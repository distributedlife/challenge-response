"use strict";

var _ = require('lodash');
var updatableEntity = require('inch-entity-updatable');
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
    var delayed = function () {
        if (controller.state === 'falseStart') {
            return;
        }

        controller.state = "challengeStarted";
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
            if (controller.state === 'ready') {
                controller.state = "waiting";
                delayedEffects.add(rollUpAnUnnvervingDelay(), delayed);
                return;
            }
            if (controller.state === 'waiting') {
                controller.state = "falseStart";
                delayedEffects.cancelAll();

                return;
            }
            if (controller.state === 'challengeStarted') {
                controller.state = 'complete';
                controller.score = data.rcvdTimestamp - controller.start;
                return;
            }
        },
        reset: function () {
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
                controller.state = "ready";
            }
        }
    });

    return controller;
};