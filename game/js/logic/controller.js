'use strict';

var each = require('lodash').each;
var min = require('lodash').min;

function isNotCompleteOrAFalseStart (currentState) {
  return currentState !== 'complete' && currentState !== 'falseStart';
}

function challengeSeen (state, ack) {
  return {
    controller: {
      start: ack.timestamp
    }
  };
}

function startChallenge (state) {
  var currentState = state.for('controller').get('state');

  if (currentState === 'falseStart') {
    return {};
  }

  return {
    controller: {
      state: 'challengeStarted'
    }
  };
}

module.exports = {
  type: 'GameBehaviour-Controller',
  deps: ['DelayedJobs', 'MeaningfulRandom', 'UUID'],
  func: function (delayed, random, uuid) {

    function rollUpAnUnnvervingDelay (state) {
      return Math.round(
        (random().number(state) * 6) + (random().number(state) * 6)
      );
    }

    function response (state, data) {
      var currentState = state.for('controller').get('state');

      if (currentState === 'ready') {
        var delay = rollUpAnUnnvervingDelay(state);
        delayed().add('pause-for-effect', delay, 'GameBehaviour-Controller', 'startChallenge');

        return {
          controller: {
            state: 'waiting'
          }
        };
      }
      if (currentState === 'waiting') {
        delayed().cancelAll('pause-for-effect');

        return {
          controller: {
            state: 'falseStart'
          }
        };
      }
      if (currentState === 'challengeStarted') {
        var start = state.for('controller').get('start');
        var score = Math.floor(data.timestamp - start);

        return {
          controller: {
            state: 'complete',
            score: score
          }
        };
      }
      return {};
    }

    function reset (state) {
      var controller = state.for('controller');
      var currentState = controller.get('state');

      if (isNotCompleteOrAFalseStart(currentState)) {
        return {};
      }

      var score = controller.get('score');
      if (currentState === 'falseStart') {
        score = 'x';
      }

      var priorScores = controller.get('priorScores');
      priorScores.push({id: uuid().gen(), score: score});
      each(priorScores, function(priorScore) {
        priorScore.best = false;
      });

      var bestScore = min(priorScores, 'score');
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

    return {
      challengeSeen: challengeSeen,
      reset: reset,
      response: response,
      startChallenge: startChallenge
    };
  }
};