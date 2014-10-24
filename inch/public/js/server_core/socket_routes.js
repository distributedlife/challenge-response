var rek = require('rekuire');
var _ = rek('lodash');
var requirejs = rek('requirejs');
requirejs.config({ baseUrl: 'inch/public/js' });

var sequence = requirejs('lib/util/sequence');
var unique = requirejs('lib/util/unique');

var statistics = {};

module.exports = function(io, game_state, user_input, watchjs, ack_map) {
	var start_update_client_loop = function(id, socket) {
		var update_client = function() {
			var packet = {
				id: sequence.next('server-origin-messages'),
				sent_timestamp: Date.now(),
				game_state: game_state
			}
			statistics[id].packets.unacked[packet.id] = packet.sent_timestamp;

			socket.volatile.emit("game_state/update", packet);
			setTimeout(update_client, 1000 / 60);
		}
		update_client();
	};

	var setup_playable_client = function(socket) {
		var id = unique.id();

		statistics[id] = {
			packets: {
				total_acked: 0,
				unacked: {}
			},
			latency: {
				total: 0
			}
		}

		var calculate_latency = function(pending_acknowledgements) {
			_.each(pending_acknowledgements, function(ack) {
				var sent_time = statistics[id].packets.unacked[ack.id];

				statistics[id].latency.total += ack.rcvd_timestamp - sent_time;
			});

			_.each(pending_acknowledgements, function(ack) {
				statistics[id].packets.total_acked += 1;
			});
		};

		var remove_acknowledged_packets = function(pending_acknowledgements) {
			_.each(pending_acknowledgements, function(ack) {
				_.each(ack.names, function(name) {
					if (ack_map[name] === undefined) { return; }

					_.each(ack_map[name], function(action) { 
					 	game_state[action.target][action.func](ack);	
					});
				});
				
				delete statistics[id].packets.unacked[ack.id];
			})
		};
		
		socket.on('disconnect', function() { 
			game_state.players -= 1; 
			game_state.paused = true; 
		});
		socket.on('input', function(input_data) { 
			user_input.raw_data = input_data; 
			user_input.rcvd_timestamp = Date.now();

			calculate_latency(input_data.pending_acks);
			remove_acknowledged_packets(input_data.pending_acks);
		});
		socket.on('pause', function() { game_state.paused = true; });
		socket.on('unpause', function() { game_state.paused = false; });

		socket.emit("game_state/setup", game_state);

		start_update_client_loop(id, socket);

		game_state.players += 1;
	};

	var setup_controller = function(socket) {
		socket.on('disconnect', function() { 
			game_state.players -= 1; 
			game_state.paused = true; 
		});
		socket.on('input', function(input_data) { 
			user_input.raw_data = input_data; 
			user_input.raw_data.rcvd_timestamp = Date.now();
		});
		socket.on('pause', function() { game_state.paused = true; });
		socket.on('unpause', function() { game_state.paused = false; });

		game_state.players += 1;
	};

	var setup_observer = function(socket) {
		socket.on('disconnect', function() { 
			game_state.observers -= 1; 
		});

		socket.emit("game_state/setup", game_state);
		
		start_update_client_loop(socket);
		
		game_state.observers += 1;
	};

	io.of('/desktop').on('connection', setup_playable_client);
	io.of('/controller').on('connection', setup_controller);
	io.of('/mobile').on('connection', setup_playable_client);
	io.of('/gamepad').on('connection', setup_playable_client);

	io.of('/observer').on('connection', setup_observer);
};