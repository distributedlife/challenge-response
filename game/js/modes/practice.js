"use strict";

//TODO: DO WE EVEN HAVE ENTITIES? OR DO WE JUST HAVE BEHAVIOUR?
// var entities = require('inch-entity-loader').loadFromPath(process.cwd() + "/game/js/entities/");
var delayedEffects = require('inch-delayed-effects').DelayedEffects();
var controllerBehaviour = require(process.cwd() + '/game/js/entities/controller')(delayedEffects);
var SocketSupport = require('inch-socket-support');
var GameState = require('inch-game-state');

module.exports = function (io) {
    var state = new GameState({
        controller: {
            start: 0,
            score: 0,
            state: 'ready',
            priorScores: []
        }
    });

    // // set the namespace for this app
    // var state = new GameState("distributedlife.challenge-response");
    // // add some state under the namespace
    // state.addState({
    // controller:
    //     {
    //         start: 0,
    //         score: 0,
    //         state: 'ready',
    //         priorScores: []
    //     }
    // });

    //TODO: solve the namespace problem.
    // state.addState("inch.core", state.core);                              //explicitly set the namespace and the initial state. This is used when?
    // state.addStateFromModule(require('inch-game-state-player-observer')); //the module define the interface providing the namespace and the code itself

    var actionMap = {
        'space': [{target: controllerBehaviour.response, keypress: true, data: state.controller}],
        'r': [{target: controllerBehaviour.reset, keypress: true, data: state.controller}]
    };
    var ackMap = {
        'show-challenge': [{target: controllerBehaviour.challengeSeen, data: state.controller}]
    };

    var inputHandler = require('inch-input-handler').InputHandler(actionMap);
    var engine = require('inch-game-engine')(state.isPaused.bind(state), [
        inputHandler.update,
        delayedEffects.update
    ]);
    engine.run(120);

    var callbacks = SocketSupport.createStandardCallbacksHash(state, inputHandler);
    SocketSupport.setup(io, callbacks, ackMap, 'practice');
};