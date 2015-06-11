'use strict';

var sequence = require('distributedlife-sequence');
var each = require('lodash').each;
var min = require('lodash').min;

module.exports = {
  type: 'GameBehaviour-Controller',
  deps: ['DelayedJobs'],
  func: function (delayedEffects) {
    var rollUpAnUnnvervingDelay = function () {
      return Math.round(Math.random() * 6) + Math.round(Math.random() * 6);
    };

    var createStartChallengeCallback = function (state) {
      return function() {
        var currentState = state.for('controller').get('state');

        if (currentState === 'falseStart') {
          return {};
        }
        return {
          controller: {
            state: 'challengeStarted'
          }
        };
      };
    };

    return {
      challengeSeen: function (state, ack) {
        return {
          controller: {
            start: ack.rcvdTimestamp
          }
        };
      },
      response: function (state, data) {
        var currentState = state.for('controller').get('state');

        if (currentState === 'ready') {
          delayedEffects().add('pause-for-effect', rollUpAnUnnvervingDelay(), createStartChallengeCallback(state));

          return {
            controller: {
              state: 'waiting'
            }
          };
        }
        if (currentState === 'waiting') {
          delayedEffects().cancelAll('pause-for-effect');

          return {
            controller: {
              state: 'falseStart'
            }
          };
        }
        if (currentState === 'challengeStarted') {
          var score = data.rcvdTimestamp - state.for('controller').get('start');

          return {
            controller: {
              state: 'complete',
              score: score
            }
          };
        }
        return {};
      },
      reset: function (state) {
        var controller = state.for('controller');

        if (controller.get('state') !== 'complete' && controller.get('state') !== 'falseStart') {
          return {};
        }

        var score = controller.get('score');
        if (controller.get('state') === 'falseStart') {
          score = 'x';
        }

        var priorScores = controller.get('priorScores');
        priorScores.push({id: sequence.next('prior-scores'), score: score});
        each(priorScores, function(priorScore) {
          priorScore.best = false;
        });

        var bestScore = min(priorScores, function(priorScore) {
          return priorScore.score;
        });
        if (bestScore !== Infinity) {
          bestScore.best = true;
        }

        return {
          controller: {
            score: 0,
            state: 'ready',
            priorScores: priorScores
          }
        };
      }
    };
  }
};