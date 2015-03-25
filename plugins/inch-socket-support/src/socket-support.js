"use strict";

var each = require('lodash').each;
var isEqual = require('lodash').isEqual;
var cloneDeep = require('lodash').cloneDeep;
var size = require('lodash').size;
var sequence = require('../../inch-sequence/src/sequence.js');

module.exports = {
  type: "SocketSupport",
  deps: ["AcknowledgementMap", "OnInput", "OnPlayerConnect", "OnPlayerDisconnect", "OnObserverConnect", "OnObserverDisconnect", "OnPause", "OnUnpause", "RawStateAccess", "StateMutator", "InitialiseState"],
  func: function(AcknowledgementMap, OnInput, OnPlayerConnect, OnPlayerDisconnect, OnObserverConnect, OnObserverDisconnect, OnPause, OnUnpause, RawStateAccess, StateMutator, InitialiseState) {

    var io;
    var statistics = {};

    var startUpdateClientLoop = function (socketId, socket) {
      var lastPacket = {};

      var updateClient = function () {
        var packet = {
          gameState: RawStateAccess()
        };

        if (isEqual(packet.gameState, lastPacket.gameState)) {
          return;
        }

        lastPacket = cloneDeep(packet);

        packet.socketId = sequence.next('server-origin-messages');
        packet.sentTimestamp = Date.now();
        statistics[socketId].packets.unacked[packet.socketId] = packet.sentTimestamp;

        socket.emit("gameState/update", packet);
      };

      setInterval(updateClient, 45);
    };

    var calculateLatency = function (socketId, pendingAcknowledgements) {
      each(pendingAcknowledgements, function (ack) {
        var sentTime = statistics[socketId].packets.unacked[ack.socketId];

        statistics[socketId].latency.total += ack.rcvdTimestamp - sentTime;
      });

      statistics[socketId].packets.totalAcked += size(pendingAcknowledgements);
    };

    var removeAcknowledgedPackets = function (socketId, pendingAcknowledgements) {
      each(pendingAcknowledgements, function (ack) {
        each(ack.names, function (name) {
          if (AcknowledgementMap()[name] === undefined) { return; }

          each(AcknowledgementMap()[name], function (action) {
            StateMutator()(action.target(ack, action.data));
          });
        });

        delete statistics[socketId].packets.unacked[ack.socketId];
      });
    };

    var createOnInputFunction = function (socketId) {
      return function (inputData) {
        var pendingAcks = inputData.pendingAcks;
        delete inputData.pendingAcks;

        each(OnInput(), function (onInputCallback) {
            onInputCallback(inputData, Date.now());
        });

        calculateLatency(socketId, pendingAcks);
        removeAcknowledgedPackets(socketId, pendingAcks);
      };
    };

    var mutateCallbackResponse = function (callbacks) {
      return function() {
        each(callbacks, function(callback) {
          StateMutator()(callback());
        });
      };
    };

    var seedSocketStatistics = function() {
      return {
        packets: {
          totalAcked: 0,
          unacked: {}
        },
        latency: {
          total: 0
        }
      };
    };

    var createSetupPlayableClientFunction = function (modeCallback) {
      return function (socket) {
        statistics[socket.id] = seedSocketStatistics();

        modeCallback();
        InitialiseState()();

        socket.on('disconnect', mutateCallbackResponse(OnPlayerDisconnect()));
        socket.on('pause', mutateCallbackResponse(OnPause()));
        socket.on('unpause', mutateCallbackResponse(OnUnpause()));

        var onInput = createOnInputFunction(socket.id);
        socket.on('input', onInput);

        socket.emit("gameState/setup", RawStateAccess());

        startUpdateClientLoop(socket.id, socket);

        each(OnPlayerConnect(), function(callback) {
          StateMutator()(callback());
        });
      };
    };

    return {
      start: function (server, modeCallbacks) {
        io = require('socket.io').listen(server);

        each(modeCallbacks, function(callback, mode) {
          io.of('/' + mode + '/primary').on('connection', createSetupPlayableClientFunction(callback));
        });
      },
      stop: function () {
        if (io !== undefined) {
          io.close();
        }
      }
    };
  }
};