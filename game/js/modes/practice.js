"use strict";

var pp = "../../../plugins"

var define = require(pp+'/inch-define-plugin/src/define.js');
// var plugins = require(pp+'/inch-plugins/src/plugin_manager.js').PluginManager;
// plugins.load(require(pp+'/inch-plugin-state-mutator-default/src/index.js'));
// plugins.load(require(pp+'/inch-plugin-behaviour-invoker-default/src/index.js'));

var delayedEffects = require(pp+'/inch-delayed-effects/src/manager.js').DelayedEffects();
//TODO: DelayedEffects should be a plugin
var controllerBehaviour = require(process.cwd() + '/game/js/entities/controller')(delayedEffects);

module.exports = {
    type: 'GameMode',
    deps: ['PluginManager'],
    func: function(plugins) {
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

        plugins().load(define("ActionMap", function () {
            return {
                'space': [{target: controllerBehaviour.response, keypress: true, data: state.controller}],
                'r': [{target: controllerBehaviour.reset, keypress: true, data: state.controller}]
            };
        }));

        plugins().load(define("AcknowledgementMap", function () {
            return {
                'show-challenge': [{
                    target: controllerBehaviour.challengeSeen,
                    namespace: 'controller',
                    data: state.controller
                }]
            };
        }));

        //TODO: everything below this line doesn't belong here. It's a framework concern that needs to happen at this step but is not something that will be controlled by the game-dev. The action and ack maps will become plugins and these modules that depend on them can declare them as deps and we can move on with our lives.

        // var inputHandler = plugins().get("InputHandler");

        socketSupportCallback(state);

        var engine = require(pp+'/inch-game-engine/src/engine.js')(state.isPaused.bind(state), //isPaused is to be loaded in as a plugin. The player could have their own onPause behaviour which they can declare now or forever hold their peace.
            [
                plugins().get("InputHandler").update,
                delayedEffects.update               //is loaded as a plugin
            ]
        );
        engine.run(120);
        };
    }
};