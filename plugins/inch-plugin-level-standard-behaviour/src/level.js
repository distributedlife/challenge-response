'use strict';

module.exports = {
  deps: ['OnPauseCallback', 'OnResumeCallback'],
  type: 'Level',
  func: function (onPauseCallbacks, onResumeCallbacks) {
    var each = require('lodash').each;
    var $ = require('zepto-browserify').$;
    var equals = require('../../inch-state-tracker/src/tracker.js').Equals;

    var pause = function () {
      $('.paused').show();
      $('#paused').show();

      each(onPauseCallbacks(), function(onPauseCallback) {
        onPauseCallback();
      });
    };
    var resume = function () {
      $('.paused').hide();
      $('#paused').hide();

      each(onResumeCallbacks(), function(onResumeCallback) {
        onResumeCallback();
      });
    };

    return {
      setup: function (scene, ackLastRequest, register, tracker) {
        var paused = function (state) { return state.inch.paused; };

        tracker.onChangeTo(paused, equals(true), pause);
        tracker.onChangeTo(paused, equals(false), resume);
      }
    };
  }
};