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
        attempts: 0,
        total: 0
    });

    var delayedEffects = require('inch-delayed-effects')();

    var stateMachine = StateMachine.create({
        initial: 'ready',
        events: [
            { name: 'ready', from: 'ready', to: 'waiting' },
            { name: 'waiting', from: 'waiting', to: 'challengeStarted' },
            { name: 'challengeStarted', from: 'challengeStarted', to: 'complete' },
            { name: 'reset', from: '*', to: 'ready' },
            { name: 'falseStart', from: '*', to: 'falseStart' },
            { name: 'gameOver', from: '*', to: 'gameOver' }
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

    var rollUpAnUnnervingDelay = function () {
        return Math.round(Math.random() * 6) + Math.round(Math.random() * 6);
    };

    _.extend(controller, updatableEntity("8secondsController", delayedEffects.update));
    _.extend(controller, {
        challengeSeen: function (ack) {
            controller.start = ack.rcvdTimestamp;
        },
        response: function () {
            if (stateMachine.is('ready')) {
                stateMachine.ready();
                delayedEffects.add(rollUpAnUnnervingDelay(), delayed);
                return;
            }
            if (stateMachine.is('waiting')) {
                stateMachine.reset();
                controller.attempts += 1;
                controller.score = 0;

                delayedEffects.cancelAll();

                return;
            }
            if (stateMachine.is('challengeStarted')) {
                stateMachine.reset();

                controller.score = data.rcvdTimestamp - controller.start;
                controller.total += controller.score;
                controller.attempts += 1;
                controller.score = 0;
                if (controller.total >= 8000) {
                    stateMachine.gameOver();
                }

                return;
            }
        },
        reset: function (force, data) {
            if (stateMachine.is('gameOver')) {
                controller.score = 0;
                controller.attempts = 0;
                controller.total = 0;

                stateMachine.reset();
            }
        }
    });

    return controller;
};