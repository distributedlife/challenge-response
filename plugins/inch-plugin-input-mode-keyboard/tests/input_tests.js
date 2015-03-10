var expect = require('expect');
var sinon = require('sinon');
var jsdom = require('jsdom').jsdom;
var _ = require('lodash');

describe("the keyboard input mode plugin", function () {
	var InputMode;
	var inputMode;
	var socket = {
		emit: sinon.spy()
	};
	var $;

	var document = function() {
		return global.window.document;
	};

	var makeFakeEvent = function(klass, type, options) {
		var event = new document().createEvent(klass);
		event.initEvent(type, true, true);
    event = _.defaults(event, options);

    return event;
	};

	var defer = function(dep) {
		return function() {
			return dep;
		}
	};

	beforeEach(function (done) {
		jsdom.env(
			"<html><body><canvas id='element'></canvas></body></html>",
			{
				done: function (err, window) {
					global.window = window;
					global.getComputedStyle = function() {};

					socket.emit.reset();

					$ = require('zepto-browserify').$;

					InputMode = require('../src/input.js').func(defer(global.window), defer("element")).InputMode;
					inputMode = new InputMode(socket);

					done();
				}
			}
		);
	});

	describe("when the mouse moves", function() {
		it("should update the current x and y values", function () {
			var event = new global.window.document.createEvent("MouseEvent");
			event.initEvent("mousemove", true, true);
	    event = _.defaults(event, {
				layerX: 45,
				layerY: 67
			});

	    $("#element")[0].dispatchEvent(event);

			expect(inputMode.getCurrentState().x).toEqual(45);
			expect(inputMode.getCurrentState().y).toEqual(67);
		});
	});

	describe("when a mouse button is pressed", function() {
		it("should register the mouse click as a key", function () {
			document().dispatchEvent(makeFakeEvent("MouseEvent", "mousedown", {which: 1}));

			expect(inputMode.getCurrentState().keys).toEqual(["button1"]);
		});

		it("should continue to register the mouse click on subsequent calls to getCurrentState", function () {
			document().dispatchEvent(makeFakeEvent("MouseEvent", "mousedown", {which: 1}));

			expect(inputMode.getCurrentState().keys).toEqual(["button1"]);
			expect(inputMode.getCurrentState().keys).toEqual(["button1"]);
		});
	});

	describe("when a mouse button is released", function() {
		it("should remove the mouse click from the current state", function () {
			document().dispatchEvent(makeFakeEvent("MouseEvent", "mousedown", {which: 1}));
			document().dispatchEvent(makeFakeEvent("MouseEvent", "mouseup", {which: 1}));

			expect(inputMode.getCurrentState().keys).toNotEqual(["button1"]);
		});
	});

	describe("when a touch press starts", function() {
		it("should register the touch event", function () {
			var event = makeFakeEvent("TouchEvent", "touchstart", {
				touches: [{
					identifier: 1,
					clientY: 0,
					clientX: 0,
					target: {
						offsetLeft: 0,
						offsetTop: 0
					}
				}]
			});

			$("#element")[0].dispatchEvent(event);

			expect(inputMode.getCurrentState().touches[0].id).toEqual(1);
			expect(inputMode.getCurrentState().touches[0].force).toEqual(1);
		});

		it("should calculate the touch position", function () {
			var event = makeFakeEvent("TouchEvent", "touchstart", {
				touches: [{
					identifier: 1,
					clientY: 54,
					clientX: 45,
					target: {
						offsetLeft: 100,
						offsetTop: 34
					}
				}]
			});

			$("#element")[0].dispatchEvent(event);

			expect(inputMode.getCurrentState().touches[0].x).toEqual(-55);
			expect(inputMode.getCurrentState().touches[0].y).toEqual(20);
		});

		it("should use the webkit touch force if it is available", function () {
			var event = makeFakeEvent("TouchEvent", "touchstart", {
				touches: [{
					identifier: 1,
					clientY: 54,
					clientX: 45,
					target: {
						offsetLeft: 100,
						offsetTop: 34
					},
					webkitForce: 0.5
				}]
			});

			$("#element")[0].dispatchEvent(event);

			expect(inputMode.getCurrentState().touches[0].force).toEqual(0.5);
		});
	});

	describe("when a touch press moves", function() {
		it("should register the touch event", function() {
			var event = makeFakeEvent("TouchEvent", "touchmove", {
				touches: [{
					identifier: 1,
					clientY: 54,
					clientX: 45,
					target: {
						offsetLeft: 100,
						offsetTop: 34
					}
				}]
			});

			$("#element")[0].dispatchEvent(event);

			expect(inputMode.getCurrentState().touches[0].id).toEqual(1);
			expect(inputMode.getCurrentState().touches[0].force).toEqual(1);
		});

		it("should calculate the touch position", function() {
			var event = makeFakeEvent("TouchEvent", "touchmove", {
				touches: [{
					identifier: 1,
					clientY: 54,
					clientX: 45,
					target: {
						offsetLeft: 100,
						offsetTop: 34
					}
				}]
			});

			$("#element")[0].dispatchEvent(event);

			expect(inputMode.getCurrentState().touches[0].x).toEqual(-55);
			expect(inputMode.getCurrentState().touches[0].y).toEqual(20);
		});

		it("should use the webkit touch force if it is available", function() {
			var event = makeFakeEvent("TouchEvent", "touchmove", {
				touches: [{
					identifier: 1,
					clientY: 54,
					clientX: 45,
					target: {
						offsetLeft: 100,
						offsetTop: 34
					},
					webkitForce: 0.5
				}]
			});

			$("#element")[0].dispatchEvent(event);

			expect(inputMode.getCurrentState().touches[0].force).toEqual(0.5);
		});
	});

	describe("when a touch press finishes", function() {
		it("should remove the touch event from the current state", function() {
			var event = makeFakeEvent("TouchEvent", "touchstart", {
				touches: [{
					identifier: 1,
					clientY: 54,
					clientX: 45,
					target: {
						offsetLeft: 100,
						offsetTop: 34
					}
				}]
			});

			$("#element")[0].dispatchEvent(event);

			var event = makeFakeEvent("TouchEvent", "touchend", {
				changedTouches: [{
					identifier: 1,
				}]
			});

			$("#element")[0].dispatchEvent(event);

			expect(inputMode.getCurrentState().touches).toEqual([]);
		});
	});

	describe("when a touch press leaves the touch area", function() {
		it("should remove the touch event from the current state", function () {
			var event = makeFakeEvent("TouchEvent", "touchstart", {
				touches: [{
					identifier: 1,
					clientY: 54,
					clientX: 45,
					target: {
						offsetLeft: 100,
						offsetTop: 34
					}
				}]
			});

			$("#element")[0].dispatchEvent(event);

			var event = makeFakeEvent("TouchEvent", "touchleave", {
				changedTouches: [{
					identifier: 1,
				}]
			});

			$("#element")[0].dispatchEvent(event);

			expect(inputMode.getCurrentState().touches).toEqual([]);
		});
	});

	describe("when a touch press is cancelled", function() {
		it("should remove the touch event from the current state", function () {
			var event = makeFakeEvent("TouchEvent", "touchstart", {
				touches: [{
					identifier: 1,
					clientY: 54,
					clientX: 45,
					target: {
						offsetLeft: 100,
						offsetTop: 34
					}
				}]
			});

			$("#element")[0].dispatchEvent(event);

			var event = makeFakeEvent("TouchEvent", "touchcancel", {
				changedTouches: [{
					identifier: 1,
				}]
			});

			$("#element")[0].dispatchEvent(event);

			expect(inputMode.getCurrentState().touches).toEqual([]);
		});
	});

	describe("when a key is pressed", function() {
		it("should register the key as a single press key", function () {
			document().dispatchEvent(makeFakeEvent("KeyboardEvent", "keypress", {which: 32 }));

			expect(inputMode.getCurrentState().singlePressKeys).toEqual(["space"]);
		});

		it("should remove the single press key after get the current state", function () {
			document().dispatchEvent(makeFakeEvent("KeyboardEvent","keypress", {which: 32 }));

			expect(inputMode.getCurrentState().singlePressKeys).toEqual(["space"]);
			expect(inputMode.getCurrentState().singlePressKeys).toEqual([]);
		});
	});

	describe("when a key is depressed", function() {
		it("should register the key as a key", function () {
			document().dispatchEvent(makeFakeEvent("KeyboardEvent", "keydown", {which: 32 }));

			expect(inputMode.getCurrentState().keys).toEqual(["space"]);
		});

		it("should continue to register the mouse click on subsequent calls to getCurrentState", function () {
			document().dispatchEvent(makeFakeEvent("KeyboardEvent", "keydown", {which: 32 }));

			expect(inputMode.getCurrentState().keys).toEqual(["space"]);
			expect(inputMode.getCurrentState().keys).toEqual(["space"]);
		});
	});

	describe("when a key is released", function() {
		it("should remove the key from the current state", function () {
			document().dispatchEvent(makeFakeEvent("KeyboardEvent", "keydown", {which: 32 }));
			document().dispatchEvent(makeFakeEvent("KeyboardEvent", "keyup", {which: 32 }));

			expect(inputMode.getCurrentState().keys).toNotEqual(["space"]);
		});
	});
});