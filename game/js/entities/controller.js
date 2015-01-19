"use strict";

// module.exports = {
//     delayed: function (controller) {
//         controller = state.controller;

//         if (controller.state === 'falseStart') {
//             return;
//         }

//         controller.state = "challengeStarted";
//     },
//     challengeSeen: function (ack, controller) {
//         controller = state.controller;

//         controller.start = ack.rcvdTimestamp;
//     },
//     rollUpAnUnnvervingDelay: function () {
//         return Math.round(Math.random() * 6) + Math.round(Math.random() * 6);
//     },
//     response: function (force, data, controller) {
//         controller = state.controller;

//         if (controller.state === 'ready') {
//             controller.state = "waiting";
//             delayedEffects.add("pause-for-effect", this.rollUpAnUnnvervingDelay(), delayed);
//             return;
//         }
//         if (controller.state === 'waiting') {
//             controller.state = "falseStart";
//             delayedEffects.cancelAll("pause-for-effect");

//             return;
//         }
//         if (controller.state === 'challengeStarted') {
//             controller.state = 'complete';
//             controller.score = data.rcvdTimestamp - controller.start;
//             return;
//         }
//     },
//     reset: function (controller) {
//         controller = state.controller;

//         if (controller.state !== 'complete' && controller.state !== "falseStart") {
//             return;
//         }

//         var score = controller.score;
//         if (controller.state === "falseStart") {
//             score = "x";
//         }

//         controller.priorScores.push({id: sequence.next("prior-scores"), score: score});
//         _.each(controller.priorScores, function(priorScore) {
//             priorScore.best = false;
//         });

//         var bestScore = _.min(controller.priorScores, function(priorScore) { return priorScore.score; });
//         bestScore.best = true;

//         controller.score = 0;
//         controller.state = "ready";
//     }
// };