'use strict';

module.exports = {
  deps: ['OnPauseCallback', 'OnResumeCallback', 'StateTrackerHelpers', 'StateTracker'],
  type: 'Level',
  func: function (onPauseCallbacks, onResumeCallbacks, trackerHelpers, tracker) {
    var each = require('lodash').each;
    var $ = require('zepto-browserify').$;
    var equals = trackerHelpers().equals;

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
      setup: function () {
        var paused = function (state) { return state.inch.paused; };

        tracker().onChangeTo(paused, equals(true), pause);
        tracker().onChangeTo(paused, equals(false), resume);
      }
    };
  }
};