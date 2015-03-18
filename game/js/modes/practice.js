"use strict";

var pp = "../../../plugins"

var define = require(pp+'/inch-define-plugin/src/define.js');

// plugins.load(require(pp+'/inch-plugin-state-mutator-default/src/index.js'));
// plugins.load(require(pp+'/inch-plugin-behaviour-invoker-default/src/index.js'));

module.exports = {
    type: 'GameMode',
    deps: ['PluginManager', "DelayedEffects", "GameBehaviour", "InputHandler"],
    func: function(plugins, DelayedEffects, GameBehaviour, InputHandler) {

        return function(socketSupportCallback) {
            //TODO: If this is here, then the state exists per HTTP request. This is not the best place to put state. Or, we do initialise the state if it has not been initialised yet. The setting up of state will be a common pattern so we want to make it painless.
            var GameState = require(pp+'/inch-game-state/src/state.js');
            var state = new GameState({
                controller: {
                    start: 0,
                    score: 0,
                    state: 'ready',
                    priorScores: []
                }
            });

            // plugins().load(define("SeedState", function () {
            //     return {
            //         controller: {
            //             start: 0,
            //             score: 0,
            //             state: 'ready',
            //             priorScores: []
            //         }
            //     };
            // });

            plugins().load(define("ActionMap", function () {
                return {
                    'space': [{target: GameBehaviour().response, keypress: true, data: state.controller}],
                    'r': [{target: GameBehaviour().reset, keypress: true, data: state.controller}]
                };
            }));

            plugins().load(define("AcknowledgementMap", function () {
                return {
                    'show-challenge': [{
                        target: GameBehaviour().challengeSeen,
                        namespace: 'controller',
                        data: state.controller
                    }]
                };
            }));

            //TODO: everything below this line doesn't belong here.
            plugins().load(define("IsPaused", function () {
                return state.isPaused.bind(state);
            }));

            socketSupportCallback(state);
        };
    }
};