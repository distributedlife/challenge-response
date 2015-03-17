"use strict";

var pp = "../../../plugins"

var define = require(pp+'/inch-define-plugin/src/define.js');
var pluginManager = require(pp+'/inch-plugins/src/plugin_manager.js').PluginManager;
pluginManager.load(require(pp+'/inch-plugin-state-mutator-default/src/index.js'));
pluginManager.load(require(pp+'/inch-plugin-behaviour-invoker-default/src/index.js'));

// var state = pluginManager.get('StateAccess');
var delayedEffects = require(pp+'/inch-delayed-effects/src/manager.js').DelayedEffects();
var SocketSupport = require(pp+'/inch-socket-support/src/socket-support.js');
var GameState = require(pp+'/inch-game-state/src/state.js');

var controllerBehaviour = require(process.cwd() + '/game/js/entities/controller')(delayedEffects);

module.exports = function (callback) {
    var state = new GameState({
        controller: {
            start: 0,
            score: 0,
            state: 'ready',
            priorScores: []
        }
    });

    var actionMap = {
        'space': [{target: controllerBehaviour.response, keypress: true, data: state.controller}],
        'r': [{target: controllerBehaviour.reset, keypress: true, data: state.controller}]
    };
    // define('ActionMap', function() {
    //     return {
    //         'space': [{target: controllerBehaviour.response, keypress: true, data: state.controller}],
    //         'r': [{target: controllerBehaviour.reset, keypress: true, data: state.controller}]
    //     }
    // })
    // pluginManager.load(require('inch-plugin-input-handler'));        //loads itself into ServerSideUpdate

    var ackMap = {
        'show-challenge': [{
            target: controllerBehaviour.challengeSeen,
            namespace: 'controller',
            data: state.controller
        }]
    };
    // define('AcknowledgementMap', function() {
    //     return {
    //         'show-challenge': [{
    //             target: controllerBehaviour.challengeSeen,
    //             namespace: 'controller'
    //             data: state.controller
    //         }];
    //     }
    // });

    var inputHandler = require(pp+'/inch-input-handler/src/input-handler.js').InputHandler(actionMap);

    callback(state, inputHandler, ackMap);

    var engine = require(pp+'/inch-game-engine/src/engine.js')(state.isPaused.bind(state), //isPaused has to be loaded in by IsPausedBehaviour?
        [
            inputHandler.update,                //is loaded as a plugin
            delayedEffects.update               //is loaded as a plugin
        ]
    );
    engine.run(120);
};