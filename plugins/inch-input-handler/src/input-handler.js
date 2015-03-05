"use strict";

var _ = require('lodash');

module.exports = {
	InputHandler: function(actionMap) {
		var userInput = [];

		var parseKeysAndButtons = function(currentInput, callback) {
			_.each(currentInput.rawData.keys, function(key) {
				if (actionMap[key] === undefined) { return; }

				_.each(actionMap[key], function(action) {
					if (!action.keypress) {
						callback(action.target, action.noEventKey, action.data);
					}
				});
			});

			_.each(currentInput.rawData.singlePressKeys, function(key) {
				if (actionMap[key] === undefined) { return; }

				_.each(actionMap[key], function(action) {
					if (action.keypress) {
						callback(action.target, action.noEventKey, action.data);
					}
				});
			});
		};

		var parseTouches = function(currentInput, callback) {
			_.each(currentInput.rawData.touches, function(touch) {
				var key = "touch" + touch.id;
				if (actionMap[key] === undefined) { return; }

				_.each(actionMap[key], function(action) {
					callback(action.target, action.noEventKey, touch.x, touch.y, action.data);
				});
			});
		};

		var parseSticks = function(currentInput, callback) {
			_.each(['leftStick', 'rightStick'], function(key) {
				if (currentInput.rawData[key] === undefined) {return;}
				if (actionMap[key] === undefined) { return; }

				var data = currentInput.rawData[key];
				_.each(actionMap[key], function(action) {
					callback(action.target, action.noEventKey, data.x, data.y, data.force, action.data);
				});
			});
		};

		return {
			newUserInput: function(newUserInput, timestamp) {
				userInput.push({ rawData: newUserInput, timestamp: timestamp });
			},
			update: function() {
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

				if (actionMap.cursor !== undefined) {
					_.each(actionMap.cursor, function(action) {
						var cx = currentInput.rawData.x;
						var cy = currentInput.rawData.y;
						action.target(cx, cy, data, action.data);
					});
				}

				_.each(actionMap.nothing, function(action) {
					if (somethingHasReceivedInput.indexOf(action.noEventKey) === -1) {
						action.target(data, action.data);
					}
				});
			}
		};
	}
};