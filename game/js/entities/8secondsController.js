"use strict";

var _ = require('lodash');
var updatable_entity = require('inch-entity-updatable');
var StateMachine = require('javascript-state-machine');
var sequence = require('inch-sequence');

module.exports = function (priorState) {
    var controller = priorState || {};
    _.defaults(controller, {
        start: 0,
        score: 0,
        state: 'ready',
        attempts: 0,
        total: 0
    });

    var delayedEffects = require('inch-delayed-effects')();

    var state_machine = StateMachine.create({
        initial: 'ready',
        events: [
            { name: 'ready', from: 'ready', to: 'waiting' },
            { name: 'waiting', from: 'waiting', to: 'challenge_started' },
            { name: 'challenge_started', from: 'challenge_started', to: 'complete' },
            { name: 'reset', from: '*', to: 'ready' },
            { name: 'false_start', from: '*', to: 'false_start' },
            { name: 'game_over', from: '*', to: 'game_over' }
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
                controller.total += controller.score;
                controller.attempts += 1;

                if (controller.total >= 8000) {
                    state_machine.game_over();
                }
                return;
            }
        },
        reset: function (force, data) {
            if (controller.state === "false_start") {
                controller.attempts += 1;
            }

            if (controller.state === 'complete' || controller.state === "false_start") {
                controller.score = 0;
                state_machine.reset();
            }
        }
    });

    return controller;
};