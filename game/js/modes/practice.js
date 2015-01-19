"use strict";

//TODO: DO WE EVEN HAVE ENTITIES? OR DO WE JUST HAVE BEHAVIOUR?
// var entities = require('inch-entity-loader').loadFromPath(process.cwd() + "/game/js/entities/");
var controllerBehaviour = require(process.cwd() + '/game/js/entities/controller');
var SocketSupport = require('inch-socket-support');
var GameState = require('inch-game-state');
var delayedEffects = require('inch-delayed-effects').DelayedEffects();
var sequence = require('inch-sequence');
var _ = require('lodash');

module.exports = function (io) {
    //TODO: define namespace when creating state
    // var state = new GameState("distributedlife.challenge-response");
    var state = new GameState({
        controller: {
            start: 0,
            score: 0,
            state: 'ready',
            priorScores: []
        }
    });

    //TODO: solve the namespace problem.
    // state.addState("inch.core", state.core);                              //explicitly set the namespace and the initial state. This is used when?
    // state.addStateFromModule(require('inch-game-state-player-observer')); //the module define the interface providing the namespace and the code itself

    var delayed = function (data, controller) {
        controller = state.controller;

        if (controller.state === 'falseStart') {
            return;
        }

        controller.state = "challengeStarted";
    };

    var challengeSeen = function (ack, controller) {
        controller.start = ack.rcvdTimestamp;
    };

    var rollUpAnUnnvervingDelay = function () {
        return Math.round(Math.random() * 6) + Math.round(Math.random() * 6);
    };

    var response = function (force, data, controller) {
        if (controller.state === 'ready') {
            controller.state = "waiting";
            delayedEffects.add("pause-for-effect", rollUpAnUnnvervingDelay(), delayed);
            return;
        }
        if (controller.state === 'waiting') {
            controller.state = "falseStart";
            delayedEffects.cancelAll("pause-for-effect");

            return;
        }
        if (controller.state === 'challengeStarted') {
            controller.state = 'complete';
            controller.score = data.rcvdTimestamp - controller.start;
            return;
        }
    };

    var reset = function (force, data, controller) {
        if (controller.state !== 'complete' && controller.state !== "falseStart") {
            return;
        }

        var score = controller.score;
        if (controller.state === "falseStart") {
            score = "x";
        }

        controller.priorScores.push({id: sequence.next("prior-scores"), score: score});
        _.each(controller.priorScores, function(priorScore) {
            priorScore.best = false;
        });

        var bestScore = _.min(controller.priorScores, function(priorScore) { return priorScore.score; });
        bestScore.best = true;

        controller.score = 0;
        controller.state = "ready";
    };

    //TODO: move controller logic to a behaviour class

    var actionMap = {
        'space': [{target: response, keypress: true, data: state.controller}],
        'r': [{target: reset, keypress: true, data: state.controller}]
    };
    var ackMap = {
        'show-challenge': [{target: challengeSeen, data: state.controller}]
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