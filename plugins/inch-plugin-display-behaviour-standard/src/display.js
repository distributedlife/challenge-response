"use strict";

module.exports = {
    deps: ['Dimensions', 'Level', 'OnMuteCallback', 'OnUnmuteCallback'],
    type: 'DisplayBehaviour',
    func: function (Dimensions, levelParts, OnMuteCallbacks, OnUnmuteCallbacks) {
        var each = require("lodash").each;
        var reject = require("lodash").reject;

        var effects = [];
        var priorStep = Date.now();
        var lastReceivedId = 0;

        var tracker = require("../../inch-state-tracker/src/tracker.js").Tracker();

        var setupComplete = false;

        require("./enable-fullscreen")();
        require("./toggle-sound")(OnMuteCallbacks(), OnUnmuteCallbacks());

        return {
            Display: function (ackLast, addAck) {
                var dims = Dimensions().Dimensions();

                each(levelParts(), function (levelPart) {
                    if (levelPart.screenResized) {
                        levelPart.screenResized(dims);
                    }
                });

                var registerEffect = function (effect) {
                    effects.push(effect);
                };

                var setup = function (state) {
                    tracker.updateState(state);

                    each(levelParts(), function (levelPart) {
                        if (levelPart.setup) {
                            levelPart.setup(
                                undefined,
                                ackLast,
                                registerEffect,
                                tracker
                            );
                        };
                    });

                    setupComplete = true;
                };

                var update = function (packet) {
                    addAck(packet.id);

                    if (packet.id <= lastReceivedId) {
                        return;
                    }
                    lastReceivedId = packet.id;

                    tracker.updateState(packet.gameState);
                };

                var doUpdate = function () {
                    var now = Date.now();

                    var dt = (now - priorStep) / 1000;
                    priorStep = Date.now();

                    each(levelParts(), function (levelPart) {
                        if (levelPart.update) {
                            levelPart.update(dt);
                        }
                    });

                    if (!setupComplete) {
                        return;
                    }

                    each(effects, function (effect) {
                        effect.tick(dt);
                    });

                    effects = reject(effects, function (effect) { return !effect.isAlive(); });
                };

                var dontUpdate = function () {
                    priorStep = Date.now();
                };

                var paused = function (state) { return state.inch.paused; };

                return {
                    setup: setup,
                    update: update,
                    updateDisplay: function () {
                        if (tracker.get(paused)) {
                            dontUpdate();
                        } else {
                            doUpdate();
                        }
                    },

                    resize: function (dims) {
                        each(levelParts(), function (levelPart) {
                            if (levelPart.screenResized) {
                                levelPart.screenResized(dims);
                            }
                        });
                    }
                };
            }
        };
    }
};