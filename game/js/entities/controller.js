"use strict";

var sequence = require('../../../plugins/inch-sequence/src/sequence.js');
var each = require('lodash').each;
var min = require('lodash').min;

module.exports = {
    type: "GameBehaviour",
    deps: ["DelayedEffects"],
    func: function (DelayedEffects) {
        var rollUpAnUnnvervingDelay = function () {
            return Math.round(Math.random() * 6) + Math.round(Math.random() * 6);
        };

        return {
            challengeSeen: function (ack, controller) {
                controller.start = ack.rcvdTimestamp;
            },
            challengeSeen2: function (state, rcvdTimestamp) {
                return {
                    start: rcvdTimestamp
                };
            },
            response: function (force, data, controller) {
                if (controller.state === 'ready') {
                    controller.state = "waiting";

                    DelayedEffects().add("pause-for-effect", rollUpAnUnnvervingDelay(), function () {
                        if (controller.state === 'falseStart') {
                            return;
                        }

                        controller.state = "challengeStarted";
                    });

                    return;
                }
                if (controller.state === 'waiting') {
                    controller.state = "falseStart";
                    DelayedEffects().cancelAll("pause-for-effect");

                    return;
                }
                if (controller.state === 'challengeStarted') {
                    controller.state = 'complete';
                    controller.score = data.rcvdTimestamp - controller.start;
                    return;
                }
            },
            reset: function (force, data, controller) {
                if (controller.state !== 'complete' && controller.state !== "falseStart") {
                    return;
                }

                var score = controller.score;
                if (controller.state === "falseStart") {
                    score = "x";
                }

                controller.priorScores.push({id: sequence.next("prior-scores"), score: score});
                each(controller.priorScores, function(priorScore) {
                    priorScore.best = false;
                });

                var bestScore = min(controller.priorScores, function(priorScore) { return priorScore.score; });
                bestScore.best = true;

                controller.score = 0;
                controller.state = "ready";
            }
        };
    }
};