"use strict";

var $ = require("zepto-browserify").$;
var _ = require("lodash");
var InchScene = require('inch-scene');
var numeral = require('numeral');

module.exports = function(THREE) {
    var effects = [];
    var prior_step = Date.now();
    var last_received_id = 0;

    var tracker = require("inch-state-tracker").Tracker();
    var the = require("inch-state-tracker").The;
    var equals = require("inch-state-tracker").Equals;

    var setupComplete = false;

    require("./enable-fullscreen")();
    require("./toggle-sound")();

    return function(config, ackLast, addAck) {
        var dims = config.dimensions(config.ratio);
        config.level.screenResized(dims);

        var camera = config.camera(dims.usableWidth, dims.usableHeight);

        var threeJsSupport = require('./threejs-support')(THREE, config);
        var threeJsScene = threeJsSupport.createScene(dims.usableWidth, dims.usableHeight);
        var inchScene = InchScene(threeJsScene);

        var renderer = threeJsSupport.createRenderer(dims.usableWidth, dims.usableHeight);
        threeJsSupport.attachRenderer(config.element, renderer);

        var registerEffect = function(effect) {
            effects.push(effect);
        };

        var paused = true;
        var pause = function() {
            paused = true;
            $('.paused').show();
            $('#paused').show();
            Howler.pauseAll();
        };
        var resume = function() {
            paused = false;
            $('.paused').hide();
            $('#paused').hide();
            Howler.resumeAll();
        };
        var updatePlayerCount = function(currentValue, priorValue) {
            $('#player-count').text(numeral(currentValue).format('0a'));
        };
        var updateObserverCount = function(currentValue, priorValue) {
            $('#observer-count').text(numeral(currentValue).format('0a'));
        };

        var setup = function(state) {
            tracker.updateState(state);

            tracker.onChangeTo(the('paused'), equals(true), pause)
            tracker.onChangeTo(the('paused'), equals(false), resume)
            tracker.onChangeOf(the('players'), updatePlayerCount);
            tracker.onChangeOf(the('observers'), updateObserverCount);

            config.level.setup(
                inchScene,
                ackLast,
                registerEffect,
                tracker
            );

            setupComplete = true;
        };

        var update = function(packet) {
            addAck(packet.id);

            if (packet.id <= last_received_id) {
                return;
            }
            last_received_id = packet.id;

            tracker.updateState(packet.game_state);
        };

        return {
            setup: setup,
            update: update,
            updateDisplay: function() {
                if (paused) {
                    prior_step = Date.now();
                    return;
                }

                //TODO: move this into update loop
                var now = Date.now();

                var dt = (now - prior_step) / 1000;
                prior_step = Date.now();

                renderer.render(inchScene.scene(), camera);

                if (!setupComplete) {
                    return;
                }

                _.each(effects, function(effect) {
                    effect.tick(dt);
                });

                effects = _.reject(effects, function(effect) { return !effect.isAlive(); });
            },

            resize: function(dims) {
                renderer.setSize(dims.usableWidth, dims.usableHeight);

                camera.aspect = dims.usableWidth / dims.usableHeight;
                camera.updateProjectionMatrix();

                config.level.screenResized(dims);
            }
        };
    };
};