"use strict";

module.exports = {
    deps: ['Dimensions', 'Level'],
    type: 'DisplayBehaviour',
    func: function (Dimensions, levelParts) {
        var _ = require("lodash");

        var effects = [];
        var priorStep = Date.now();
        var lastReceivedId = 0;

        var tracker = require("../../inch-state-tracker/src/tracker.js").Tracker();
        var the = require("../../inch-state-tracker/src/tracker.js").The;

        var setupComplete = false;

        require("./enable-fullscreen")();
        require("./toggle-sound")();

        return {
            Display: function (ackLast, addAck) {
                var dims = Dimensions().Dimensions();

                _.each(levelParts(), function (levelPart) {
                    if (levelPart.screenResized) {
                        levelPart.screenResized(dims);
                    }
                });

                var registerEffect = function (effect) {
                    effects.push(effect);
                };

                var setup = function (state) {
                    tracker.updateState(state);

                    //TODO: inchScene and camera will need to be passed another way
                    _.each(levelParts(), function (levelPart) {
                        if (levelPart.setup) {
                            levelPart.setup(
                                undefined,
                                ackLast,
                                registerEffect,
                                tracker,
                                undefined
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

                    _.each(levelParts(), function (levelPart) {
                        if (levelPart.update) {
                            levelPart.update(dt);
                        }
                    });

                    if (!setupComplete) {
                        return;
                    }

                    _.each(effects, function (effect) {
                        effect.tick(dt);
                    });

                    effects = _.reject(effects, function (effect) { return !effect.isAlive(); });
                };

                var dontUpdate = function () {
                    priorStep = Date.now();
                };

                return {
                    setup: setup,
                    update: update,
                    updateDisplay: function () {
                        if (tracker.get(the('paused'))) {
                            dontUpdate();
                        } else {
                            doUpdate();
                        }
                    },

                    resize: function (dims) {
                        _.each(levelParts(), function (levelPart) {
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