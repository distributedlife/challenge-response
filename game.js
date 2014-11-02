"use strict";

var entities = require('inch-entity-loader').loadFromPath(process.cwd() + "/game/js/entities/");
var state = require('inch-game-state').andExtendWith({
  	controller: new entities.controller()
});
var actionMap = {
	'space': [{target: state.controller.response, keypress: true}],
	'r': [{target: state.controller.reset, keypress: true}]
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

var pathToAssets = process.cwd() + "/game"
var pathToLevel = "game/levels/default";

var hideAllTheExpressStuff = function(pathToAssets, routes) {
	var express = require('express');

	var app = express();
	app.use('/game', express.static(pathToAssets));
	app.use('/inch', express.static(process.cwd() + '/inch/public/'));
	app.set('views', process.cwd() + '/inch/public/views');
	app.use(require('morgan')('combined'));
	app.use(require('body-parser').urlencoded({extended: true }));
	app.use(require('body-parser').json());
	app.set('view options', {layout: false});
	app.engine('haml', require('consolidate').haml);
	
	routes.configure(app);

	return require('http').createServer(app);
};
// var server = require('inch-express-server')(pathToAssets, require('./inch/public/js/server_core/default_routes')(pathToLevel));
var server = hideAllTheExpressStuff(pathToAssets, require('./inch/public/js/server_core/default_routes')(pathToLevel));
server.listen(process.env.PORT || 3000);

require('inch-socket-support')(server, callbacks, ackMap);