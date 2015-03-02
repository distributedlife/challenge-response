"use strict";

var _ = require('lodash');
var delayedEffect = require('./delayed_effect');

module.exports = {
    DelayedEffects: function () {
        var effects = [];

        var prune = function () {
            return _.reject(effects, function (t) {
                return !t.isAlive();
            });
        };

        return {
            add: function (key, duration, onComplete) {
                effects.push(Object.create(delayedEffect(key, duration, onComplete)));
            },
            update: function (dt) {
                _.each(effects, function (effect) {
                    effect.tick(dt);
                });

                prune();
            },
            cancelAll: function (key) {
                _.each(effects, function (effect) {
                    if (effect.key === key || key === undefined) {
                        effect.cancel();
                    }
                });
            }
        };
    }
};