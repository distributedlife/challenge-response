var assert = require('assert');
var sinon = require('sinon');
var expect = require('expect');
var InputHandler = require('../src/input-handler.js').InputHandler;

var model = {
	noEvent: sinon.spy(),
	keyEvent: sinon.spy(),
	keyPressEvent: sinon.spy(),
	touchEvent: sinon.spy(),
	cursorEvent: sinon.spy(),
	leftStickEvent: sinon.spy(),
	rightStickEvent: sinon.spy()
};

var actions = {};
var rawData = {};
var inputHandler = undefined;
var suppliedData = {'a': 'b'};

describe("Input Bindings", function() {
	var clock;

	before(function () {
		clock = sinon.useFakeTimers();
	})

	beforeEach(function() {
		model.noEvent.reset();
		model.keyEvent.reset();
		model.keyPressEvent.reset();
		model.touchEvent.reset();
		model.cursorEvent.reset();
		model.leftStickEvent.reset();
		model.rightStickEvent.reset();

		actions = {
			'key': [
				{target: model.keyEvent, noEventKey: 'model', data: suppliedData},
				{target: model.keyPressEvent, keypress: true, noEventKey: 'model', data: suppliedData}
			],
			'touch0': [{target: model.touchEvent, noEventKey: 'model', data: suppliedData}],
			'cursor': [{target: model.cursorEvent, noEventKey: 'model', data: suppliedData}],
			'nothing': [{target: model.noEvent, noEventKey: 'model', data: suppliedData}],
			'leftStick': [{target: model.leftStickEvent, noEventKey: 'model', data: suppliedData}],
			'rightStick': [{target: model.rightStickEvent, noEventKey: 'model', data: suppliedData}],
		};

		inputHandler = InputHandler(actions);
	});

	after(function () {
		clock.restore();
	});

	describe("when no input has been received", function() {
		beforeEach(function() {
			rawData = { keys: [], touches: [] };
			inputHandler.newUserInput(rawData);
		})

		it("should call the 'noEvent' on the 'model' bound as 'nothing'", function() {
			inputHandler.update();
			assert(model.noEvent.called);
		});

		it('should pass in the standard event data', function () {
			inputHandler.update();
			var expected = {rcvdTimestamp: undefined};

			expect(model.noEvent.firstCall.args[0]).toEqual(expected);
		});

		it('should pass in any specified optional data', function () {
			inputHandler.update();
			expect(model.noEvent.firstCall.args[1]).toEqual({"a":"b"});
		});

		describe("when the action map has not been configured for 'nothing'", function() {
			beforeEach(function() {
				inputHandler = InputHandler({});
			});

			it ("should do nothing", function() {
				inputHandler.update();
				assert(!model.noEvent.called);
			});
		});
	})

	describe("when key input is received", function() {
		beforeEach(function() {
			rawData = { keys: ['key'], touches: [] };
			inputHandler.newUserInput(rawData);
		})

		it("should not call the 'noEvent' on the 'model' bound as 'nothing'", function() {
			inputHandler.update();
			assert(!model.noEvent.called);
		});

		it("should call any matching functions with a force of one, event data and supplied data", function() {
			inputHandler.update();
			expect(model.keyEvent.firstCall.args).toEqual([1.0, {rcvdTimestamp: undefined}, suppliedData]);
			assert(!model.keyPressEvent.called);
		});
	});

	describe("when key input is received as keypress", function() {
		beforeEach(function() {
			rawData = { singlePressKeys: ['key'], touches: [] };
			inputHandler.newUserInput(rawData);
		})

		it("should not call the 'noEvent' on the 'model' bound as 'nothing'", function() {
			inputHandler.update();
			assert(!model.noEvent.called);
		});

		it("should call any matching functions with a force of one, event data and supplied data", function() {
			inputHandler.update();
			expect(model.keyPressEvent.firstCall.args).toEqual([1.0, {rcvdTimestamp: undefined}, suppliedData]);
			assert(!model.keyEvent.called);
		});
	});

	describe("when key input is recieved but not bound", function () {
		beforeEach(function() {
			rawData = { keys: ['notBound'], singlePressKeys: ['notBound'], touches: [{id: 0, x: 4, y: 5}] };
			inputHandler.newUserInput(rawData);
		})

		it("should do nothing if there are no events bound to that key", function () {
			inputHandler.update();

			assert(!model.keyEvent.called);
			assert(!model.keyPressEvent.called);
			assert(!model.noEvent.called);
		});
	});

	describe("when touch input is received", function() {
		beforeEach(function() {
			rawData = { touches: [{id: 0, x: 4, y: 5}] };
			inputHandler.newUserInput(rawData);
		})

		it("should not call the 'noEvent' on the 'model' bound as 'nothing'", function() {
			inputHandler.update();
			assert(!model.noEvent.called);
		});

		it("should call any matching functions with the touch coordinates, event data and supplied data", function() {
			inputHandler.update();
			expect(model.touchEvent.firstCall.args).toEqual([4, 5, {rcvdTimestamp: undefined}, suppliedData]);
		});
	});

	describe("when touch is recieved but not bound", function () {
		beforeEach(function() {
			rawData = { keys: ['key'], touches: [{id: 1, x: 4, y: 5}] };
			inputHandler.newUserInput(rawData);
		})

		it("should do nothing if there are no events bound to that key", function () {
			inputHandler.update();

			assert(!model.touchEvent.called);
			assert(!model.noEvent.called);
		})
	});

	describe("when mouse input is received", function() {
		beforeEach(function() {
			rawData = { x: 6, y: 7 };
			inputHandler.newUserInput(rawData);
		})

		it("should call any matching functions with the touch coordinates, event data and supplied data", function() {
			inputHandler.update();
			expect(model.cursorEvent.firstCall.args).toEqual([6,7, {rcvdTimestamp: undefined}, suppliedData]);
		});
	});

	describe("when mouse input is received but not bound", function() {
		beforeEach(function() {
			rawData = { x: 6, y: 7 };
			inputHandler = InputHandler({});
			inputHandler.newUserInput(rawData);
		})

		it("should not call any matching functions with the touch coordinates", function() {
			inputHandler.update();
			expect(model.cursorEvent.called).toEqual(false);
		});
	});

	describe("when stick input is received", function () {
		beforeEach(function() {
			rawData = {
				leftStick: {x: 0.1, y: 1.0, force: 0.5},
				rightStick: {x: 0.9, y: 0.3, force: 1.0}
			};
			inputHandler.newUserInput(rawData, Date.now());
		});

		it("should call any matching functions with direction vector and the fource", function () {
			inputHandler.update();
			expect(model.leftStickEvent.firstCall.args).toEqual([0.1, 1.0, 0.5, {rcvdTimestamp: Date.now()}, suppliedData]);
			expect(model.rightStickEvent.firstCall.args).toEqual([0.9, 0.3, 1.0, {rcvdTimestamp: Date.now()}, suppliedData]);
		});
	});

	describe("when stick input is received but not bound", function () {
		beforeEach(function() {
			inputHandler = InputHandler({});
			rawData = {
				leftStick: {x: 0.1, y: 1.0, force: 0.5},
				rightStick: {x: 0.9, y: 0.3, force: 1.0}
			};
			inputHandler.newUserInput(rawData, Date.now());
		});

		it("should call any matching functions with direction vector and the fource", function () {
			inputHandler.update();
			expect(model.leftStickEvent.called).toEqual(false);
			expect(model.rightStickEvent.called).toEqual(false);
		});
	});
});