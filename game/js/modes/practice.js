"use strict";

module.exports = {
    type: 'GameMode-Practice',
    deps: ['DefinePlugin', "GameBehaviour-Controller"],
    func: function(DefinePlugin, Controller) {
        return function() {
            //TODO: If this is here, then the state exists per HTTP request. This is not the best place to put state. Or, we do initialise the state if it has not been initialised yet. The setting up of state will be a common pattern so we want to make it painless.
            DefinePlugin()("StateSeed", function () {
                return {
                    controller: {
                        start: 0,
                        score: 0,
                        state: 'ready',
                        priorScores: []
                    }
                };
            });

            DefinePlugin()("ActionMap", function () {
                return {
                    'space': [{target: Controller().response, keypress: true}],
                    'r': [{target: Controller().reset, keypress: true}]
                };
            });

            DefinePlugin()("AcknowledgementMap", function () {
                return {
                    'show-challenge': [{
                        target: Controller().challengeSeen
                    }]
                };
            });
        };
    }
};