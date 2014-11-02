"use strict";

var inch_files = "./inch";
var game_files = "./game/js";

var _ = require('lodash');
var express = require('express');
var app = express();
require(inch_files+'/configure_express')(app, express, require('consolidate'));

var server = require('http').createServer(app);




var entities = require('inch-entity-loader').loadFromPath("../../game/js/entities/");
var state = require('inch-game-state').andExtendWith({
  	controller: new entities.controller()
});



var game_logic = require(game_files+'/logic')(state, entities);


var actionMap = {
	'space': [{target: state.controller.response, keypress: true}],
	'r': [{target: state.controller.reset, keypress: true}]
};
var InputHandler = require('inch-input-handler');
var inputHandler = new InputHandler(actionMap);



var acks = {
	'show-challenge': [state.controller.challenge_seen]
};
var callbacks = {
	onPlayerConnect: state.playerConnected.bind(state),
	onPlayerDisconnect: state.playerDisconnected.bind(state),
	onObserverConnect: state.observerConnected.bind(state),
	onObserverDisconnect: state.observerDisconnected.bind(state),
	onPause: state.pause.bind(state),
	onUnpause: state.unpause.bind(state),
	onNewUserInput: inputHandler.newUserInput,
	getGameState: function() { return state; }
};
require('inch-socket-support')(server, callbacks, acks);



require(game_files+'/routes')(app, state);



var Engine = require('inch-game-engine');
var engine = new Engine(state.isPaused.bind(state), [
	state.update.bind(state), 
	inputHandler.update, 
	game_logic.update
]);
engine.run(120);




require(inch_files+'/requirejs_node_config')(require('requirejs'));
server.listen(process.env.PORT || 3000);