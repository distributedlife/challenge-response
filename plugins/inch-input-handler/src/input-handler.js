"use strict";

var each = require('lodash').each;

module.exports = {
	type: "OnInput",
	deps: ["ActionMap", "DefinePlugin", "StateMutator"],
	func: function(actionMap, definePlugin, stateMutator) {
		var userInput = [];

		var parseKeysAndButtons = function(currentInput, callback) {
			each(currentInput.rawData.keys, function(key) {
				if (actionMap()[key] === undefined) { return; }

				each(actionMap()[key], function(action) {
					if (!action.keypress) {
						stateMutator()(
							callback(action.target, action.noEventKey, action.data)
						);
					}
				});
			});

			each(currentInput.rawData.singlePressKeys, function(key) {
				if (actionMap()[key] === undefined) { return; }

				each(actionMap()[key], function(action) {
					if (action.keypress) {
						stateMutator()(
							callback(action.target, action.noEventKey, action.data)
						);
					}
				});
			});
		};

		var parseMouse = function(currentInput, callback) {
			console.log(currentInput);
			if (actionMap().cursor === undefined) { return; }

			each(actionMap().cursor, function(action) {
				stateMutator()(
					callback(action.target, action.noEventKey, currentInput.rawData.x, currentInput.rawData.y, action.data)
				);
			});
		};

		var parseTouches = function(currentInput, callback) {
			each(currentInput.rawData.touches, function(touch) {
				var key = "touch" + touch.id;
				if (actionMap()[key] === undefined) { return; }

				each(actionMap()[key], function(action) {
					stateMutator()(
						callback(action.target, action.noEventKey, touch.x, touch.y, action.data)
					);
				});
			});
		};

		var parseSticks = function(currentInput, callback) {
			each(['leftStick', 'rightStick'], function(key) {
				if (currentInput.rawData[key] === undefined) {return;}
				if (actionMap()[key] === undefined) { return; }

				var data = currentInput.rawData[key];
				each(actionMap()[key], function(action) {
					stateMutator()(
						callback(action.target, action.noEventKey, data.x, data.y, data.force, action.data)
					);
				});
			});
		};

		definePlugin()("ServerSideUpdate", function () {
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

				parseMouse(currentInput, function(target, noEventKey, x, y, suppliedData) {
					somethingHasReceivedInput.push(noEventKey);
					return target(x, y, data, suppliedData);
				});

				each(actionMap().nothing, function(action) {
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