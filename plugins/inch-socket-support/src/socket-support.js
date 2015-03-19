"use strict";

var _ = require('lodash');
var each = require('lodash').each;
var sequence = require('../../inch-sequence/src/sequence.js');

//TODO: State here is at per-server-instance level
var statistics = {};

module.exports = {
    type: "SocketSupport",
    deps: ["AcknowledgementMap", "InputHandler", "ServerSideEngine", "OnPlayerConnect", "OnPlayerDisconnect", "OnObserverConnect", "OnObserverDisconnect", "OnPause", "OnUnpause", "RawStateAccess", "StateMutator", "PluginManager"],
    func: function(AcknowledgementMap, InputHandler, Engine, OnPlayerConnect, OnPlayerDisconnect, OnObserverConnect, OnObserverDisconnect, OnPause, OnUnpause, RawStateAccess, StateMutator, plugins) {

        return function (io, modeCallbacks) {
            var startUpdateClientLoop = function (id, socket) {
                var lastPacket = {};

                var updateClient = function () {
                    var packet = {
                        gameState: RawStateAccess()
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
                each(pendingAcknowledgements, function (ack) {
                    var sentTime = statistics[id].packets.unacked[ack.id];

                    statistics[id].latency.total += ack.rcvdTimestamp - sentTime;
                });

                statistics[id].packets.totalAcked += _.size(pendingAcknowledgements);
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

                    InputHandler().newUserInput(inputData, Date.now());
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
                    plugins().get("InitialiseState")();

                    //TODO: we may be able to move this out of here. It's not really a socket concern; more of a sequencing concern... that's probably unrealised
                    Engine()().run(120);


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
        };
    }
};