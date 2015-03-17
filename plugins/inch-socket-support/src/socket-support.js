"use strict";

var _ = require('lodash');
var sequence = require('../../inch-sequence/src/sequence.js');
var unfurl = require('inch-unfurl');

var statistics = {};

var createStandardCallbacksHash = function (state, inputHandler) {
    return {
        onPlayerConnect: state.playerConnected.bind(state),
        onPlayerDisconnect: state.playerDisconnected.bind(state),
        onObserverConnect: state.observerConnected.bind(state),
        onObserverDisconnect: state.observerDisconnected.bind(state),
        onPause: state.pause.bind(state),
        onUnpause: state.unpause.bind(state),
        onNewUserInput: inputHandler.newUserInput,
        getGameState: function () { return state; }
    };
};

module.exports = {
    setup: function (io, modeCallbacks, mode) {
        var ackMap = {};

        var unfurledCallbacks = {};

        var startUpdateClientLoop = function (id, socket) {
            var lastPacket = {};

            var updateClient = function () {
                var packet = {
                    gameState: unfurledCallbacks.getGameState()
                };

                if (_.isEqual(packet.gameState, lastPacket.gameState)) {
                    return;
                }

                lastPacket = _.cloneDeep(packet);

                packet.id = sequence.next('server-origin-messages');
                packet.sentTimestamp = Date.now();
                statistics[id].packets.unacked[packet.id] = packet.sentTimestamp;

                socket.emit("gameState/update", packet);
            };

            setInterval(updateClient, 45);
        };

        var calculateLatency = function (id, pendingAcknowledgements) {
            _.each(pendingAcknowledgements, function (ack) {
                var sentTime = statistics[id].packets.unacked[ack.id];

                statistics[id].latency.total += ack.rcvdTimestamp - sentTime;
            });

            statistics[id].packets.totalAcked += _.size(pendingAcknowledgements);
        };

        var removeAcknowledgedPackets = function (id, pendingAcknowledgements) {
            _.each(pendingAcknowledgements, function (ack) {
                _.each(ack.names, function (name) {
                    if (ackMap[name] === undefined) { return; }

                    _.each(ackMap[name], function (action) {
                        action.target(ack, action.data);
                    });
                });

                delete statistics[id].packets.unacked[ack.id];
            });
        };

        var createOnInputFunction = function (id) {
            return function (inputData) {
                var pendingAcks = inputData.pendingAcks;
                delete inputData.pendingAcks;

                unfurledCallbacks.onNewUserInput(inputData, Date.now());
                calculateLatency(id, pendingAcks);
                removeAcknowledgedPackets(id, pendingAcks);
            };
        };

        var setupPlayableClient = function (socket) {
            var id = socket.id;

            statistics[id] = {
                packets: {
                    totalAcked: 0,
                    unacked: {}
                },
                latency: {
                    total: 0
                }
            };


            //This is a dirty hack
            modeCallbacks[mode](function(state, inputHandler, acknowledgementMap) {

                ackMap = acknowledgementMap;
                var socketCallbacks = createStandardCallbacksHash(state, inputHandler);

                unfurledCallbacks = {
                    onPlayerConnect: unfurl.arrayWithGuarantee(socketCallbacks.onPlayerConnect),
                    onPlayerDisconnect: unfurl.arrayWithGuarantee(socketCallbacks.onPlayerDisconnect),
                    onObserverConnect: unfurl.arrayWithGuarantee(socketCallbacks.onObserverConnect),
                    onObserverDisconnect: unfurl.arrayWithGuarantee(socketCallbacks.onObserverDisconnect),
                    onPause: unfurl.arrayWithGuarantee(socketCallbacks.onPause),
                    onUnpause: unfurl.arrayWithGuarantee(socketCallbacks.onUnpause),
                    onNewUserInput: unfurl.arrayWithGuarantee(socketCallbacks.onNewUserInput),
                    getGameState: socketCallbacks.getGameState
                };
            });



            var onInput = createOnInputFunction(id);

            socket.on('disconnect', unfurledCallbacks.onPlayerDisconnect);
            socket.on('input', onInput);
            socket.on('pause', unfurledCallbacks.onPause);
            socket.on('unpause', unfurledCallbacks.onUnpause);

            socket.emit("gameState/setup", unfurledCallbacks.getGameState());

            startUpdateClientLoop(id, socket);

            unfurledCallbacks.onPlayerConnect();
        };

        io.of('/' + mode + '/primary').on('connection', setupPlayableClient);
    }
};