"use strict";


var express = require('express');
var app = express();
require('./inch/configure_express')(app, express, require('consolidate'));
var server = require('http').createServer(app);




var entities = require('inch-entity-loader').loadFromPath("../../game/js/entities/");
var state = require('inch-game-state').andExtendWith({
  	controller: new entities.controller()
});


var game_files = "./game/js";
var game_logic = require(game_files+'/logic')(state, entities);


var actionMap = {
	'space': [{target: state.controller.response, keypress: true}],
	'r': [{target: state.controller.reset, keypress: true}]
};
var inputHandler = require('inch-input-handler')(actionMap);



var acks = {
	'show-challenge': [state.controller.challenge_seen]
};
var callbacks = require('inch-standard-socket-support-callbacks')(state, inputHandler);
require('inch-socket-support')(server, callbacks, acks);



require(game_files+'/routes')(app, state);



var engine = require('inch-game-engine')(state.isPaused.bind(state), [
	state.update.bind(state), 
	inputHandler.update, 
	game_logic.update
]);
engine.run(120);




require('./inch/requirejs_node_config')(require('requirejs'));
server.listen(process.env.PORT || 3000);