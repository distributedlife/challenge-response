"use strict";

var reject = require('lodash').reject;
var each = require('lodash').each;
var delayedEffect = require('./delayed_effect');

module.exports = {
    type: "DelayedEffects",
    deps: ["PluginManager"],
    func: function (Plugins) {
        var effects = [];

        var prune = function () {
            return reject(effects, function (t) {
                return !t.isAlive();
            });
        };


        var update = {
            type: "ServerSideUpdate",
            func: function() {
                return function (dt) {
                    each(effects, function (effect) {
                        effect.tick(dt);
                    });

                    prune();
                };
            }
        };
        Plugins().load(update);

        return {
            add: function (key, duration, onComplete) {
                effects.push(Object.create(delayedEffect(key, duration, onComplete)));
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