"use strict";

var entities = require('inch-entity-loader').loadFromPath(process.cwd() + "/game/js/entities/");

module.exports = function (server) {
    var state = require('inch-game-state').andExtendWith({
        controller: new entities.controller()
    });
    var actionMap = {
        'space': [{target: state.controller.response, keypress: true}],
        'r': [{target: state.controller.reset.bind(state.controller), keypress: true}]
    };
    var ackMap = {
        'show-challenge': [state.controller.challenge_seen]
    };
    var game_logic = require(process.cwd() + "/game/js/logic")(state);


    var inputHandler = require('inch-input-handler')(actionMap);
    var engine = require('inch-game-engine')(state.isPaused.bind(state), [
        state.update.bind(state),
        inputHandler.update,
        game_logic.update
    ]);
    engine.run(120);

    var callbacks = require('inch-standard-socket-support-callbacks')(state, inputHandler);
    require('inch-socket-support')(server, callbacks, ackMap);
};