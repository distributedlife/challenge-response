"use strict";

var _ = require('lodash');

var root = {};
var provideReadAccessToState = function(stateHash) {
  return function(key) {
    if (_.isObject(stateHash[key]) && !_.isArray(stateHash[key])) {
      return provideReadAccessToState(stateHash[key]);
    } else {
      return stateHash[key];
    }
  };
};

var rootNodeAccess = provideReadAccessToState(root);
var Access = {
  type: "StateAccess",
  func: function () {
    return {
      get: function(key) {
        return rootNodeAccess(key);
      },
      add: function (namespace, obj) {
        root[namespace] = obj;
      }
    };
  }
};

module.exports = {
  type: "StateMutator",
  deps: ["PluginManager"],
  func: function (pluginManager) {
    pluginManager().load(Access);

    return function(result) {
      root = _.merge(root, result, function (a, b) { return _.isArray(a) ? b : undefined; });
    };
  }
};