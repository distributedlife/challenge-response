"use strict";

var _ = require('lodash');

function GameState(customState) {
	this.players = 0;
	this.observers = 0;
	this.paused = true;
	this.started = Date.now();
	this.dimensions = { width: 1000, height: 500 };
	this.wireframes = [];

	_.extend(this, customState);
}

GameState.prototype.playerConnected = function() {
	this.players += 1;
};

GameState.prototype.playerDisconnected = function() {
	this.players -= 1;
	this.paused = true;
};

GameState.prototype.observerConnected = function() {
	this.observers += 1;
};

GameState.prototype.observerDisconnected = function() {
	this.observers -= 1;
};

GameState.prototype.pause = function() {
	this.paused = true;
};

GameState.prototype.unpause = function() {
	this.paused = false;
};

GameState.prototype.isPaused = function() {
	return this.paused;
};

module.exports = GameState;