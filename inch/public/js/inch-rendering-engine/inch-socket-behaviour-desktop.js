"use strict";

var _ = require('lodash');
var io = require('socket.io-client');

module.exports = function(window, config, flushPendingAcks) {
	var controls = [];
	var lastPacket = {};

	var configureEmitFunction = function(socket) {
		return function() {
			var packet = {}
		
			_.each(controls, function(control) {
				_.extend(packet, control.getCurrentState());
			});

			packet.pending_acks = flushPendingAcks();

			if (_.isEqual(packet, lastPacket)) {
				//TODO: count packets not sent vs. packets sent to see whether we bother with this check.
	            return;
	        }

			packet.sent_timestamp = Date.now();
			socket.emit('input', packet);
		}
	}

	return {
		connect: function(setupFunc, updateFunc) {
			var socket = io.connect('/desktop');

		    if (window.document.hasFocus()) { 
		        socket.emit('unpause'); 
		    }
		    
		    socket.on('disconnect', config.connectDisconnectBehaviour.disconnected);
		    socket.on('connect', config.connectDisconnectBehaviour.connected);
		    socket.on('game_state/setup', setupFunc);
		    socket.on('game_state/update', updateFunc);
		    socket.on('error', function(data) { throw Error(data); });

		    _.each(config.controls, function(control) {
				controls.push(control(socket, config));
		    });

		    setInterval(configureEmitFunction(socket), 1000 / 120);
		}
	};
};