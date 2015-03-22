"use strict";

var reject = require('lodash').reject;
var each = require('lodash').each;
var delayedEffect = require('./delayed_effect');

module.exports = {
    type: "DelayedEffects",
    deps: ["DefinePlugin", "StateMutator"],
    func: function (DefinePlugin, StateMutator) {
        var effects = [];

        var prune = function () {
            return reject(effects, function (t) {
                return !t.isAlive();
            });
        };


        DefinePlugin()("ServerSideUpdate", function() {
            return function (dt) {
                each(effects, function (effect) {
                    effect.tick(dt);
                });

                prune();
            };
        });

        return {
            add: function (key, duration, onComplete) {
                var wrapOnCompleteWithStateMutation = function () {
                    StateMutator()(onComplete());
                }

                effects.push(Object.create(delayedEffect(key, duration, wrapOnCompleteWithStateMutation)));
            },
            cancelAll: function (key) {
                each(effects, function (effect) {
                    if (effect.key === key || key === undefined) {
                        effect.cancel();
                    }
                });
            }
        };
    }
};