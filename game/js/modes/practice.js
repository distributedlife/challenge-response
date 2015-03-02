"use strict";

var rek = require('rekuire');
var define = rek('plugins/inch-define-plugin');
var pluginManager = rek('plugins/inch-plugins');
pluginManager.load(rek('plugins/inch-plugin-state-mutator-default'));
pluginManager.load(rek('plugins/inch-plugin-behaviour-invoker-default'));

// var state = pluginManager.get('StateAccess');
var delayedEffects = require('inch-delayed-effects').DelayedEffects();
var SocketSupport = require('inch-socket-support');
var GameState = require('inch-game-state');

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

    var inputHandler = require('inch-input-handler').InputHandler(actionMap);

    // pluginManager.load(require('inch-plugin-game-engine-default'));


    var engine = require('inch-game-engine')(state.isPaused.bind(state), [      //isPaused has to be loaded in by IsPausedBehaviour?
        inputHandler.update,                //is loaded as a plugin
        delayedEffects.update               //is loaded as a plugin
    ]);
    engine.run(120);

    var callbacks = SocketSupport.createStandardCallbacksHash(state, inputHandler);
    SocketSupport.setup(io, callbacks, ackMap, 'practice');
};