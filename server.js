"use strict";

var inch_files = "./inch";
var framework_files = inch_files+'/public/js/server_core';
var game_files = "./game/js";

var _ = require('lodash');
var express = require('express');
var app = express();
require(inch_files+'/configure_express')(app, express, require('consolidate'));

var server = require('http').createServer(app);
var io = require('socket.io').listen(server);

var entities = require(framework_files+'/entities');
var game_state = require(framework_files+'/initial_state');
_.extend(game_state, require(game_files+'/state')(entities));

var game_logic = require(game_files+'/logic')(game_state, entities);
var action_map = require(game_files+'/action_map');

var watchjs = require('watchjs');
var user_input = {
	raw_data: {}
};
require(framework_files+'/socket_routes')(io, game_state, user_input, watchjs, action_map.acks);
require(game_files+'/routes')(app, game_state);

var input_bindings = require(framework_files+'/input_bindings')(game_state, user_input, action_map.input, watchjs);
var game_engine = require(framework_files+'/engine')(game_state, game_logic, input_bindings);

game_engine.run();

require(inch_files+'/requirejs_node_config')(require('requirejs'));
server.listen(process.env.PORT || 3000);