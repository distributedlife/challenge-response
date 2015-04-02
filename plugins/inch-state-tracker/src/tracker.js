'use strict';

var _ = require('lodash');

module.exports = {
  Equals: function (expectedValue) {
      return function (currentValue) {
          return _.isEqual(currentValue, expectedValue);
      };
  },
  The: function (name) {
      return function (state) { return state[name]; };
  },
  To: function (name) {
      return function (state) { return state[name]; };
  },
  From: function (name) {
      return function (state) { return state[name]; };
  },
  Within: function (name) {
      return function (state) { return state[name]; };
  },
  Tracker: function () {
    var priorState;
    var currentState;
    var changes = [];

    var invokeCallback = function (callback, model, priorModel, data) {
      if (_.isArray(data)) {
        var args = _.clone(data);
        args.unshift(model, priorModel);
        callback.apply(this, args);
      } else {
        callback(model, priorModel, data);
      }
    };

    var hasChanged = function (f) {
      if (priorState === undefined) { return true; }

      return !_.isEqual(f(priorState), f(currentState));
    };

    var currentValue = function (f) {
      if (currentState === undefined) {
        return undefined;
      }

      return f(currentState);
    };
    var priorValue = function (f) {
      if (priorState === undefined) {
        return undefined;
      }

      return f(priorState);
    };
    var currentElement = function (f, model) {
      if (currentState === undefined) {
        return undefined;
      }

      return _.where(f(currentState), {id: model.id})[0];
    };
    var priorElement = function (f, model) {
      if (priorState === undefined) {
        return undefined;
      }

      return _.where(f(priorState), {id: model.id})[0];
    };
    var elementAdded = function (f, model) {
      return (_.where(f(priorState), {id: model.id}).length === 0);
    };
    var elementRemoved = function (f, model) {
      return (_.where(f(currentState), {id: model.id}).length === 0);
    };
    var elementChanged = function (f, model) {
      if (priorState === undefined) { return true; }

      var current = _.where(f(currentState), {id: model.id});
      var prior = _.where(f(priorState), {id: model.id});
      return !_.isEqual(current, prior);
    };
    var handleObjects = function (change) {
      if (hasChanged(change.focus)) {
        if (!change.when) {
          invokeCallback(change.callback, currentValue(change.focus), priorValue(change.focus), change.data);
          return;
        }

        if (change.when(currentValue(change.focus))) {
          invokeCallback(change.callback, currentValue(change.focus), priorValue(change.focus), change.data);
        }
      }
    };
    var handleArrays = function (change) {
      _.each(change.operatesOn(change.focus), function (model) {
        if (change.detectionFunc(change.focus, model)) {
          invokeCallback(change.callback, currentElement(change.focus, model), priorElement(change.focus, model), change.data);
        }
      });
    };
    var sendCurrentContentsNow = function (change) {
      invokeCallback(change.callback, currentValue(change.focus), undefined, change.data);
    };

    var handle = {
      'array': handleArrays,
      'object': handleObjects
    };

    var detectChangesAndNotifyObservers = function () {
      _.each(changes, function (change) {
        handle[change.type](change);
      });
    };

    return {
      get: function (model) {
        return currentValue(model);
      },
      updateState: function (newState) {
        priorState = currentState;
        currentState = newState;

        detectChangesAndNotifyObservers();
      },
      onChangeOf: function (model, callback, data) {
        var change = {
          type: 'object',
          focus: model,
          callback: callback,
          data: data
        };

        changes.push(change);
      },
      onChangeTo: function (model, condition, callback, data) {
        var change = {
          type: 'object',
          focus: model,
          'when': condition,
          callback: callback,
          data: data
        };

        handleObjects(change);
        changes.push(change);
      },
      onElementChanged: function (focusArray, callback, data) {
        var change = {
          type: 'array',
          focus: focusArray,
          callback: callback,
          detectionFunc: elementChanged,
          operatesOn: currentValue,
          data: data
        };

        changes.push(change);
      },
      onElementAdded: function (focusArray, onCallback, existingCallback, data) {
        var change = {
          type: 'array',
          focus: focusArray,
          callback: onCallback,
          detectionFunc: elementAdded,
          operatesOn: currentValue,
          data: data
        };

        changes.push(change);
        sendCurrentContentsNow({
          focus: focusArray,
          callback: existingCallback,
          data: data
        });
      },
      onElementRemoved: function (focusArray, callback, data) {
        var change = {
          type: 'array',
          focus: focusArray,
          callback: callback,
          detectionFunc: elementRemoved,
          operatesOn: priorValue,
          data: data
        };

        changes.push(change);
      }
    };
  }
};