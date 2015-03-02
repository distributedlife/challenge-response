"use strict";

var _ = require('lodash');
var rek = require('rekuire');
var define = rek('plugins/inch-define-plugin/src/define.js');

module.exports = define("BehaviourInvoker", ["StateMutator"], function (stateMutator) {
  return function (toInvoke, suppliedState, optionalData) {
    var changedState;

    if (_.isArray(optionalData)) {
      var args = _.clone(optionalData);
      args.unshift(suppliedState);
      changedState = toInvoke.apply(this, args);
    } else {
      if (optionalData) {
        changedState = toInvoke(suppliedState, optionalData);
      } else {
        changedState = toInvoke(suppliedState);
      }
    }

    stateMutator()(changedState);
  };
});