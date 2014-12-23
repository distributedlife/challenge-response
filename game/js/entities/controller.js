"use strict";

var _ = require('lodash');
var updatableEntity = require('inch-entity-updatable');
var StateMachine = require('javascript-state-machine');
var sequence = require('inch-sequence');

module.exports = function (priorState) {
    var controller = priorState || {};
    _.defaults(controller, {
        start: 0,
        score: 0,
        state: 'ready',
        priorScores: []
    });

    var delayedEffects = require('inch-delayed-effects')();

    var stateMachine = StateMachine.create({
        initial: 'ready',
        events: [
            { name: 'ready', from: 'ready', to: 'waiting' },
            { name: 'waiting', from: 'waiting', to: 'challengeStarted' },
            { name: 'challengeStarted', from: 'challengeStarted', to: 'complete' },
            { name: 'reset', from: '*', to: 'ready' },
            { name: 'falseStart', from: '*', to: 'falseStart' }
        ],
        callbacks: {
            onstate: function () { controller.state = this.current; }
        }
    });

    var delayed = function () {
        if (stateMachine.is('falseStart')) {
            return;
        }

        stateMachine.waiting();
    };

    var rollUpAnUnnvervingDelay = function () {
        return Math.round(Math.random() * 6) + Math.round(Math.random() * 6);
    };

    _.extend(controller, updatableEntity("controller", delayedEffects.update));
    _.extend(controller, {
        challengeSeen: function (ack) {
            controller.start = ack.rcvdTimestamp;
        },
        response: function (force, data) {
            if (stateMachine.is('ready')) {
                stateMachine.ready();
                delayedEffects.add(rollUpAnUnnvervingDelay(), delayed);
                return;
            }
            if (stateMachine.is('waiting')) {
                stateMachine.falseStart();

                delayedEffects.cancelAll();

                return;
            }
            if (stateMachine.is('challengeStarted')) {
                stateMachine.challengeStarted();
                controller.score = data.rcvdTimestamp - controller.start;
                return;
            }
        },
        reset: function (force, data) {
            if (controller.state === 'complete' || controller.state === "falseStart") {

                if (controller.state === "falseStart") {
                    this.priorScores.push({id: sequence.next("prior-scores"), score: "x"});
                } else {
                    this.priorScores.push({id: sequence.next("prior-scores"), score: controller.score});

                    _.each(this.priorScores, function(priorScore) {
                        priorScore.best = false;
                    });

                    var bestScore = _.min(this.priorScores, function(priorScore) { return priorScore.score; });
                    bestScore.best = true;
                }

                controller.score = 0;
                stateMachine.reset();
            }
        }
    });

    return controller;
};