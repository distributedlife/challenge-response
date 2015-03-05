"use strict";

var define = require('../../../plugins/inch-define-plugin/src/define.js');
var pluginManager = require('../../../plugins/inch-plugins/src/plugin_manager.js').PluginManager;
pluginManager.load(require('../../../plugins/inch-plugin-state-mutator-default/src/index.js'));
pluginManager.load(require('../../../plugins/inch-plugin-behaviour-invoker-default/src/index.js'));

// var state = pluginManager.get('StateAccess');
var delayedEffects = require('../../../plugins/inch-delayed-effects/src/delayed_effect.js');
var SocketSupport = require('../../../plugins/inch-socket-support/src/socket-support.js');
var GameState = require('../../../plugins/inch-game-state/src/state.js');

var controllerBehaviour = require(process.cwd() + '/game/js/entities/controller')(delayedEffects);

module.exports = function (io) {
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

    var inputHandler = require('../../../plugins/inch-input-handler/src/input-handler.js').InputHandler(actionMap);

    // pluginManager.load(require('inch-plugin-game-engine-default'));


    var engine = require('../../../plugins/inch-game-engine/src/engine.js')(state.isPaused.bind(state), [      //isPaused has to be loaded in by IsPausedBehaviour?
        inputHandler.update,                //is loaded as a plugin
        delayedEffects.update               //is loaded as a plugin
    ]);
    engine.run(120);

    var callbacks = SocketSupport.createStandardCallbacksHash(state, inputHandler);
    SocketSupport.setup(io, callbacks, ackMap, 'practice');
};