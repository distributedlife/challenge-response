"use strict";

var sequence = require('../../../plugins/inch-sequence/src/sequence.js');
var each = require('lodash').each;
var min = require('lodash').min;

module.exports = {
    type: "GameBehaviour",
    deps: ["DelayedEffects", "StateAccess"],
    func: function (DelayedEffects, State) {
        var rollUpAnUnnvervingDelay = function () {
            return Math.round(Math.random() * 6) + Math.round(Math.random() * 6);
        };

        return {
            challengeSeen: function (ack) {
                return {
                    controller: {
                        start: ack.rcvdTimestamp
                    }
                }
            },
            response: function (force, data) {
                var get = State().get;

                if (get("controller")("state") === 'ready') {
                    DelayedEffects().add("pause-for-effect", rollUpAnUnnvervingDelay(), function () {
                        if (get("controller")("state") === 'falseStart') {
                            return {};
                        }
                        return {
                            controller: {
                                state: "challengeStarted"
                            }
                        };
                    });
                    return {
                        controller: {
                            state: "waiting"
                        }
                    };
                }
                if (get("controller")("state") === 'waiting') {
                    DelayedEffects().cancelAll("pause-for-effect");

                    return {
                        controller: {
                            state: "falseStart"
                        }
                    };
                }
                if (get("controller")("state") === 'challengeStarted') {
                    var score = data.rcvdTimestamp - get("controller")("start");

                    return {
                        controller: {
                            state: 'complete',
                            score: score
                        }
                    };
                }
                return {};
            },
            reset: function (force, data) {
                var get = State().get;

                if (get("controller")("state") !== 'complete' && get("controller")("state") !== "falseStart") {
                    return {};
                }

                var score = get("controller")("score");
                if (get("controller")("state") === "falseStart") {
                    score = "x";
                }

                var priorScores = get("controller")("priorScores");
                priorScores.push({id: sequence.next("prior-scores"), score: score});
                each(priorScores, function(priorScore) {
                    priorScore.best = false;
                });

                var bestScore = min(priorScores, function(priorScore) { return priorScore.score; });
                bestScore.best = true;

                return {
                    controller: {
                        score: 0,
                        state: "ready",
                        priorScores: priorScores
                    }
                }
            }
        };
    }
};