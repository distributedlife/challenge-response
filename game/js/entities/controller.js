"use strict";

var _ = require('lodash');
var updatable_entity = require('inch-entity-updatable');
var StateMachine = require('javascript-state-machine');
var sequence = require('inch-sequence');

module.exports = function (priorState) {
    console.log("priorState", priorState);
    var controller = priorState || {};
    _.defaults(controller, {
        start: 0,
        score: 0,
        state: 'ready',
        priorScores: []
    });

    var delayedEffects = require('inch-delayed-effects')();

    var state_machine = StateMachine.create({
        initial: 'ready',
        events: [
            { name: 'ready', from: 'ready', to: 'waiting' },
            { name: 'waiting', from: 'waiting', to: 'challenge_started' },
            { name: 'challenge_started', from: 'challenge_started', to: 'complete' },
            { name: 'reset', from: '*', to: 'ready' },
            { name: 'false_start', from: '*', to: 'false_start' }
        ],
        callbacks: {
            onstate: function () { controller.state = this.current; }
        }
    });

    var delayed = function () {
        if (state_machine.is('false_start')) {
            return;
        }

        state_machine.waiting();
    };

    var roll_up_an_unnerving_delay = function () {
        return Math.round(Math.random() * 6) + Math.round(Math.random() * 6);
    };

    _.extend(controller, updatable_entity("controller", delayedEffects.update));
    _.extend(controller, {
        challenge_seen: function (ack) {
            controller.start = ack.rcvdTimestamp;
        },
        response: function (force, data) {
            if (state_machine.is('ready')) {
                state_machine.ready();
                delayedEffects.add(roll_up_an_unnerving_delay(), delayed);
                return;
            }
            if (state_machine.is('waiting')) {
                state_machine.false_start();

                delayedEffects.cancelAll();

                return;
            }
            if (state_machine.is('challenge_started')) {
                state_machine.challenge_started();
                controller.score = data.rcvd_timestamp - controller.start;
                return;
            }
        },
        reset: function (force, data) {
            if (controller.state === 'complete' || controller.state === "false_start") {

                if (controller.state === "false_start") {
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
                state_machine.reset();
            }
        }
    });

    return controller;
};