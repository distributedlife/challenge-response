'use strict';

var isEqual = require('lodash').isEqual;

module.exports = {
  type: 'StateTrackerHelpers',
  func: function () {
    return {
      equals: function (expectedValue) {
        return function (currentValue) {
          return isEqual(currentValue, expectedValue);
        };
      }
    };
  }
};