'use strict';

var each = require('lodash').each;

module.exports = {
	type: 'OnInput',
	deps: ['ActionMap', 'DefinePlugin', 'StateMutator'],
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

		var parseTouches = function(currentInput, callback) {
			each(currentInput.rawData.touches, function(touch) {
				var key = 'touch' + touch.id;
				if (actionMap()[key] === undefined) { return; }

				each(actionMap()[key], function(action) {
					stateMutator()(
						callback(action.target, action.noEventKey, {x: touch.x, y: touch.y}, action.data)
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
						callback(action.target, action.noEventKey,{x: data.x, y: data.y, force: data.force}, action.data)
					);
				});
			});
		};

		definePlugin()('ServerSideUpdate', function () {
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

				parseTouches(currentInput, function(target, noEventKey, inputData, suppliedData) {
					somethingHasReceivedInput.push(noEventKey);
					return target(inputData.x, inputData.y, data, suppliedData);
				});

				parseSticks(currentInput, function(target, noEventKey, inputData, suppliedData) {
					somethingHasReceivedInput.push(noEventKey);
					return target(inputData.x, inputData.y, inputData.force, data, suppliedData);
				});

				if (actionMap().cursor !== undefined) {
					each(actionMap().cursor, function(action) {
						var cx = currentInput.rawData.x;
						var cy = currentInput.rawData.y;
						return action.target(cx, cy, data, action.data);
					});
				}

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