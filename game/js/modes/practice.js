"use strict";

var pp = "../../../plugins"

var define = require(pp+'/inch-define-plugin/src/define.js');

module.exports = {
    type: 'GameMode',
    deps: ['PluginManager', "GameBehaviour"],
    func: function(plugins, GameBehaviour) {
        return function() {
            //TODO: If this is here, then the state exists per HTTP request. This is not the best place to put state. Or, we do initialise the state if it has not been initialised yet. The setting up of state will be a common pattern so we want to make it painless.
            plugins().load(define("StateSeed", function () {
                return {
                    controller: {
                        start: 0,
                        score: 0,
                        state: 'ready',
                        priorScores: []
                    }
                };
            }));

            plugins().load(define("ActionMap", function () {
                return {
                    'space': [{target: GameBehaviour().response, keypress: true}],
                    'r': [{target: GameBehaviour().reset, keypress: true}]
                };
            }));

            plugins().load(define("AcknowledgementMap", function () {
                return {
                    'show-challenge': [{
                        target: GameBehaviour().challengeSeen
                    }]
                };
            }));
        };
    }
};