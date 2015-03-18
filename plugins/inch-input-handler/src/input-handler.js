"use strict";

var define = require('../../inch-define-plugin/src/define.js');
var each = require('lodash').each;

module.exports = {
	type: "InputHandler",
	deps: ["ActionMap", "PluginManager"],
	func: function(ActionMap, PluginManager) {
		var userInput = [];

		var parseKeysAndButtons = function(currentInput, callback) {
			each(currentInput.rawData.keys, function(key) {
				if (ActionMap()[key] === undefined) { return; }

				each(ActionMap()[key], function(action) {
					if (!action.keypress) {
						callback(action.target, action.noEventKey, action.data);
					}
				});
			});

			each(currentInput.rawData.singlePressKeys, function(key) {
				if (ActionMap()[key] === undefined) { return; }

				each(ActionMap()[key], function(action) {
					if (action.keypress) {
						callback(action.target, action.noEventKey, action.data);
					}
				});
			});
		};

		var parseTouches = function(currentInput, callback) {
			each(currentInput.rawData.touches, function(touch) {
				var key = "touch" + touch.id;
				if (ActionMap()[key] === undefined) { return; }

				each(ActionMap()[key], function(action) {
					callback(action.target, action.noEventKey, touch.x, touch.y, action.data);
				});
			});
		};

		var parseSticks = function(currentInput, callback) {
			each(['leftStick', 'rightStick'], function(key) {
				if (currentInput.rawData[key] === undefined) {return;}
				if (ActionMap()[key] === undefined) { return; }

				var data = currentInput.rawData[key];
				each(ActionMap()[key], function(action) {
					callback(action.target, action.noEventKey, data.x, data.y, data.force, action.data);
				});
			});
		};

		var update = {
			type: "ServerSideUpdate",
			func: function () {
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
						target(1.0, data, suppliedData);
						somethingHasReceivedInput.push(noEventKey);
					});

					parseTouches(currentInput, function(target, noEventKey, x, y, suppliedData) {
						target(x, y, data, suppliedData);
						somethingHasReceivedInput.push(noEventKey);
					});

					parseSticks(currentInput, function(target, noEventKey, x, y, force, suppliedData) {
						target(x, y, force, data, suppliedData);
						somethingHasReceivedInput.push(noEventKey);
					});

					if (ActionMap().cursor !== undefined) {
						each(ActionMap().cursor, function(action) {
							var cx = currentInput.rawData.x;
							var cy = currentInput.rawData.y;
							action.target(cx, cy, data, action.data);
						});
					}

					each(ActionMap().nothing, function(action) {
						if (somethingHasReceivedInput.indexOf(action.noEventKey) === -1) {
							action.target(data, action.data);
						}
					});
				};
			}
		};
		PluginManager().load(update);

		return {
			newUserInput: function(newUserInput, timestamp) {
				userInput.push({ rawData: newUserInput, timestamp: timestamp });
			}
		};
	}
};