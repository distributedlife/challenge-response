"use strict";

var newPracticeGame = function (server) {
    var entities = require('inch-entity-loader').loadFromPath(process.cwd() + "/game/js/entities/");
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
    var game_logic = require('./game/js/logic')(state);


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

var server = require("./inch-express")("./game", require('./inch-default-routes-no-auth')({
    'practice': newPracticeGame
}));
server.listen(process.env.PORT || 3000);