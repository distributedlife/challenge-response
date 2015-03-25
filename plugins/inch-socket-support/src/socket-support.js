"use strict";

var each = require('lodash').each;
var isEqual = require('lodash').isEqual;
var cloneDeep = require('lodash').cloneDeep;
var size = require('lodash').size;
var sequence = require('../../inch-sequence/src/sequence.js');

var statistics = {};

module.exports = {
    type: "SocketSupport",
    deps: ["AcknowledgementMap", "OnInput", "OnPlayerConnect", "OnPlayerDisconnect", "OnObserverConnect", "OnObserverDisconnect", "OnPause", "OnUnpause", "RawStateAccess", "StateMutator", "InitialiseState"],
    func: function(AcknowledgementMap, OnInput, OnPlayerConnect, OnPlayerDisconnect, OnObserverConnect, OnObserverDisconnect, OnPause, OnUnpause, RawStateAccess, StateMutator, InitialiseState) {

        var io;

        return {
            start: function (server, modeCallbacks) {
                io = require('socket.io').listen(server);

                var startUpdateClientLoop = function (id, socket) {
                    var lastPacket = {};

                    var updateClient = function () {
                        var packet = {
                            gameState: RawStateAccess()
                        };

                        if (isEqual(packet.gameState, lastPacket.gameState)) {
                            return;
                        }

                        lastPacket = cloneDeep(packet);

                        packet.id = sequence.next('server-origin-messages');
                        packet.sentTimestamp = Date.now();
                        statistics[id].packets.unacked[packet.id] = packet.sentTimestamp;

                        socket.emit("gameState/update", packet);
                    };

                    setInterval(updateClient, 45);
                };

                var calculateLatency = function (id, pendingAcknowledgements) {
                    each(pendingAcknowledgements, function (ack) {
                        var sentTime = statistics[id].packets.unacked[ack.id];

                        statistics[id].latency.total += ack.rcvdTimestamp - sentTime;
                    });

                    statistics[id].packets.totalAcked += size(pendingAcknowledgements);
                };

                var removeAcknowledgedPackets = function (id, pendingAcknowledgements) {
                    each(pendingAcknowledgements, function (ack) {
                        each(ack.names, function (name) {
                            if (AcknowledgementMap()[name] === undefined) { return; }

                            each(AcknowledgementMap()[name], function (action) {
                                StateMutator()(action.target(ack, action.data));
                            });
                        });

                        delete statistics[id].packets.unacked[ack.id];
                    });
                };

                var createOnInputFunction = function (id) {
                    return function (inputData) {
                        var pendingAcks = inputData.pendingAcks;
                        delete inputData.pendingAcks;

                        each(OnInput(), function (onInputCallback) {
                            onInputCallback(inputData, Date.now());
                        });

                        calculateLatency(id, pendingAcks);
                        removeAcknowledgedPackets(id, pendingAcks);
                    };
                };

                var createSetupPlayableClientFunction = function (modeCallback) {
                    return function (socket) {
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

                        modeCallback();
                        InitialiseState()();

                        var onInput = createOnInputFunction(id);

                        var mutateCallbackResponse = function (callbacks) {
                            return function() {
                                each(callbacks, function(callback) {
                                    StateMutator()(callback());
                                });
                            };
                        }

                        socket.on('disconnect', mutateCallbackResponse(OnPlayerDisconnect()));
                        socket.on('input', onInput);
                        socket.on('pause', mutateCallbackResponse(OnPause()));
                        socket.on('unpause', mutateCallbackResponse(OnUnpause()));

                        socket.emit("gameState/setup", RawStateAccess());

                        startUpdateClientLoop(id, socket);

                        each(OnPlayerConnect(), function(callback) {
                            StateMutator()(callback());
                        });
                    };
                };

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