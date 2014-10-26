"use strict";

var rek = require('rekuire');
var StateMachine = rek('javascript-state-machine');

module.exports = function(options) {
	var fsm = StateMachine.create(options);

	fsm.cycle = function() {
		fsm[fsm.current]();
	};

	return fsm;	
};