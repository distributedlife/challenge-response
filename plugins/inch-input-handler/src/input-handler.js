"use strict";

var each = require('lodash').each;

module.exports = {
	type: "OnInput",
	deps: ["ActionMap", "DefinePlugin", "StateMutator"],
	func: function(ActionMap, DefinePlugin, StateMutator) {
		var userInput = [];

		var parseKeysAndButtons = function(currentInput, callback) {
			each(currentInput.rawData.keys, function(key) {
				if (ActionMap()[key] === undefined) { return; }

				each(ActionMap()[key], function(action) {
					if (!action.keypress) {
						StateMutator()(
							callback(action.target, action.noEventKey, action.data)
						);
					}
				});
			});

			each(currentInput.rawData.singlePressKeys, function(key) {
				if (ActionMap()[key] === undefined) { return; }

				each(ActionMap()[key], function(action) {
					if (action.keypress) {
						StateMutator()(
							callback(action.target, action.noEventKey, action.data)
						);
					}
				});
			});
		};

		var parseTouches = function(currentInput, callback) {
			each(currentInput.rawData.touches, function(touch) {
				var key = "touch" + touch.id;
				if (ActionMap()[key] === undefined) { return; }

				each(ActionMap()[key], function(action) {
					StateMutator()(
						callback(action.target, action.noEventKey, touch.x, touch.y, action.data)
					);
				});
			});
		};

		var parseSticks = function(currentInput, callback) {
			each(['leftStick', 'rightStick'], function(key) {
				if (currentInput.rawData[key] === undefined) {return;}
				if (ActionMap()[key] === undefined) { return; }

				var data = currentInput.rawData[key];
				each(ActionMap()[key], function(action) {
					StateMutator()(
						callback(action.target, action.noEventKey, data.x, data.y, data.force, action.data)
					);
				});
			});
		};

		DefinePlugin()("ServerSideUpdate", function () {
			return function () {
				var currentInput = userInput.shift();
				if (currentInput === undefined) {
					return;
				}

				var data = {
					rcvdTimestamp: currentInput.timestamp
				};

				var somethingHasReceivedInput = [];
				parseKeysAndButtons(currentInput, function(target, noEventKey, suppliedData) {
					somethingHasReceivedInput.push(noEventKey);
					return target(1.0, data, suppliedData);
				});

				parseTouches(currentInput, function(target, noEventKey, x, y, suppliedData) {
					somethingHasReceivedInput.push(noEventKey);
					return target(x, y, data, suppliedData);
				});

				parseSticks(currentInput, function(target, noEventKey, x, y, force, suppliedData) {
					somethingHasReceivedInput.push(noEventKey);
					return target(x, y, force, data, suppliedData);
				});

				if (ActionMap().cursor !== undefined) {
					each(ActionMap().cursor, function(action) {
						var cx = currentInput.rawData.x;
						var cy = currentInput.rawData.y;
						return action.target(cx, cy, data, action.data);
					});
				}

				each(ActionMap().nothing, function(action) {
					if (somethingHasReceivedInput.indexOf(action.noEventKey) === -1) {
						return action.target(data, action.data);
					}
				});
			};
		});

		return function(rawData, timestamp) {
			userInput.push({ rawData: rawData, timestamp: timestamp });
		};
	}
};