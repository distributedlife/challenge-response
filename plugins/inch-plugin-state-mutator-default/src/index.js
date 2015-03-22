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

module.exports = {
  type: "StateMutator",
  deps: ["DefinePlugin"],
  func: function (DefinePlugin) {
    DefinePlugin()("StateAccess", function () {
      return {
        get: function(key) {
          return rootNodeAccess(key);
        },
        add: function (namespace, obj) {
          root[namespace] = obj;
        }
      };
    });
    DefinePlugin()("RawStateAccess", function () { return root; });

    return function(result) {
      root = _.merge(root, result, function (a, b) { return _.isArray(a) ? b : undefined; });
    };
  }
};