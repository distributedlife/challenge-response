"use strict";

var entities = require('inch-entity-loader').loadFromPath(process.cwd() + "/game/js/entities/");
var SocketSupport = require('inch-socket-support');
var GameState = require('inch-game-state');

module.exports = function (io) {
    var state = new GameState({
        controller: new entities['8secondsController']()
    });
    var actionMap = {
        'space': [{target: state.controller.response, keypress: true}],
        'r': [{target: state.controller.reset.bind(state.controller), keypress: true}]
    };
    var ackMap = {
        'show-challenge': [state.controller.challengeSeen]
    };

    var inputHandler = require('inch-input-handler').InputHandler(actionMap);
    var engine = require('inch-game-engine')(state.isPaused.bind(state), [
        inputHandler.update,
        state.controller.update
    ]);
    engine.run(120);

    var callbacks = SocketSupport.createStandardCallbacksHash(state, inputHandler);
    SocketSupport.setup(io, callbacks, ackMap, '8seconds');
};