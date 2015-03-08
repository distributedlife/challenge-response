"use strict";

module.exports = {
    deps: ['Dimensions', 'Camera', 'RenderEngineAdapter', 'Element', 'Level'],
    type: 'DisplayBehaviour',
    func: function (Dimensions, Camera, adapter, element, levelParts) {
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
                var dims = Dimensions.Dimensions();

                _.each(levelParts, function (levelPart) {
                    levelPart.screenResized(dims);
                });


                //TODO: pull the setup render stuff out of here. It's a render engine layer concern
                var camera = Camera.Camera();

                var threeJsScene = adapter.createScene();
                var inchScene = require('../../inch-scene/src/scene.js')(threeJsScene);

                var renderer = adapter.createRenderer();
                adapter.attachRenderer(element, renderer);



                var registerEffect = function (effect) {
                    effects.push(effect);
                };

                var setup = function (state) {
                    tracker.updateState(state);

                    //TODO: inchScene and camera will need to be passed another way
                    _.each(levelParts, function (levelPart) {
                        levelPart.setup(
                            inchScene,
                            ackLast,
                            registerEffect,
                            tracker,
                            camera
                        );
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


                    //TODO: pull the setup render stuff out of here. It's a render engine layer concern. It still needs to be called here
                    renderer.render(inchScene.scene(), camera);



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
                        renderer.setSize(dims.usableWidth, dims.usableHeight);

                        //TODO: can we use dims.ratio?
                        adapter.setCameraAspectRatio(camera, dims.usableWidth / dims.usableHeight);

                        //TODO: move this technical detail into the adapter
                        adapter.updateProjectionMatrix(camera);

                        _.each(levelParts, function (levelPart) {
                            levelPart.screenResized(dims);
                        });
                    }
                };
            }
        };
    }
};