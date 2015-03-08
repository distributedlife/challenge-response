var expect = require('expect');
var sinon = require('sinon');
var jsdom = require('jsdom').jsdom;

describe("the keyboard input mode plugin", function () {
	var InputMode;
	var inputMode;
	var socket = {
		emit: sinon.spy()
	};
	var $;

	var defer = function(dep) {
		return function() {
			return dep;
		}
	};

	var callInputEventOnClass = function(klass, eventName, data, n) {
		n = n || 0;
		$(klass)[0]._listeners[eventName].false[n](data)
	};

	var callInputEventOn = function(eventName, data, n) {
		n = n || 0;
		$("#element")[0]._listeners[eventName].false[n](data)
	};

	var callWindowInputEvent = function(eventName, data, n) {
		n = n || 0;
		$(global.window)[0]._listeners[eventName].false[n](data)
	};

	var callWindowDocumentInputEvent = function(eventName, data, n) {
		n = n || 0;
		$(global.window.document)[0]._listeners[eventName].false[n](data)
	};

	before(function(done) {
		jsdom.env({
			html: "<html><body><div id=\"element\">With content.</div><div id=\"derp\" class=\"button key-space\">With content.</div><div class=\"button\">Derp</div></body></html>",
			done: function(err, window) {
				global.window = window;
				global.getComputedStyle = function() {};

				done();
			}});
	});

	beforeEach(function () {
		$ = require('zepto-browserify').$;

		socket.emit.reset();

		InputMode = require('../src/input.js').func(defer(global.window), defer("element")).InputMode;
		inputMode = new InputMode(socket);
	});

	describe("when the mouse moves", function() {
		it("should update the current x and y values", function () {
			callInputEventOn("mousemove", {
				layerX: 45,
				layerY: 67
			});

			expect(inputMode.getCurrentState().x).toEqual(45);
			expect(inputMode.getCurrentState().y).toEqual(67);
		});
	});

	describe("when a mouse button is pressed", function() {
		it("should register the mouse click as a key", function () {
			callWindowInputEvent("mousedown", {which: 1}, 1);

			expect(inputMode.getCurrentState().keys).toEqual(["button1"]);
		});

		it("should continue to register the mouse click on subsequent calls to getCurrentState", function () {
			callWindowInputEvent("mousedown", {which: 1}, 2);

			expect(inputMode.getCurrentState().keys).toEqual(["button1"]);
			expect(inputMode.getCurrentState().keys).toEqual(["button1"]);
		});
	});

	describe("when a mouse button is released", function() {
		it("should remove the mouse click from the current state", function () {
			callWindowInputEvent("mousedown", {which: 1});

			callWindowInputEvent("mouseup", {which: 1});
			expect(inputMode.getCurrentState().keys).toNotEqual(["button1"]);
		});
	});

	describe("when a touch press starts", function() {
		it("should register the touch event", function () {
			callInputEventOn("touchstart", {
				touches: [{
					identifier: 1,
					clientY: 0,
					clientX: 0,
					target: {
						offsetLeft: 0,
						offsetTop: 0
					}
				}]
			}, 4);

			expect(inputMode.getCurrentState().touches[0].id).toEqual(1);
			expect(inputMode.getCurrentState().touches[0].force).toEqual(1);
		});

		it("should calculate the touch position", function () {
			callInputEventOn("touchstart", {
				touches: [{
					identifier: 1,
					clientY: 54,
					clientX: 45,
					target: {
						offsetLeft: 100,
						offsetTop: 34
					}
				}]
			}, 5);

			expect(inputMode.getCurrentState().touches[0].x).toEqual(-55);
			expect(inputMode.getCurrentState().touches[0].y).toEqual(20);
		});

		it("should use the webkit touch force if it is available", function () {
			callInputEventOn("touchstart", {
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
			}, 6);

			expect(inputMode.getCurrentState().touches[0].force).toEqual(0.5);
		});
	});

	describe("when a touch press moves", function() {
		it("should register the touch event", function() {
			callInputEventOn("touchmove", {
				touches: [{
					identifier: 1,
					clientY: 54,
					clientX: 45,
					target: {
						offsetLeft: 100,
						offsetTop: 34
					}
				}]
			}, 7);

			expect(inputMode.getCurrentState().touches[0].id).toEqual(1);
			expect(inputMode.getCurrentState().touches[0].force).toEqual(1);
		});

		it("should calculate the touch position", function() {
			callInputEventOn("touchmove", {
				touches: [{
					identifier: 1,
					clientY: 54,
					clientX: 45,
					target: {
						offsetLeft: 100,
						offsetTop: 34
					}
				}]
			}, 8);

			expect(inputMode.getCurrentState().touches[0].x).toEqual(-55);
			expect(inputMode.getCurrentState().touches[0].y).toEqual(20);
		});

		it("should use the webkit touch force if it is available", function() {
			callInputEventOn("touchmove", {
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
			}, 9);

			expect(inputMode.getCurrentState().touches[0].force).toEqual(0.5);
		});
	});

	describe("when a touch press finishes", function() {
		it("should remove the touch event from the current state", function() {
			callInputEventOn("touchstart", {
				touches: [{
					identifier: 1,
					clientY: 54,
					clientX: 45,
					target: {
						offsetLeft: 100,
						offsetTop: 34
					}
				}]
			}, 10);

			callInputEventOn("touchend", {
				changedTouches: [{
					identifier: 1,
				}]
			}, 10);

			expect(inputMode.getCurrentState().touches).toEqual([]);
		});
	});

	describe("when a touch press leaves the touch area", function() {
		it("should remove the touch event from the current state", function () {
			callInputEventOn("touchstart", {
				touches: [{
					identifier: 1,
					clientY: 54,
					clientX: 45,
					target: {
						offsetLeft: 100,
						offsetTop: 34
					}
				}]
			}, 11);

			callInputEventOn("touchleave", {
				changedTouches: [{
					identifier: 1,
				}]
			}, 11);

			expect(inputMode.getCurrentState().touches).toEqual([]);
		});
	});

	describe("when a touch press is cancelled", function() {
		it("should remove the touch event from the current state", function () {
			callInputEventOn("touchstart", {
				touches: [{
					identifier: 1,
					clientY: 54,
					clientX: 45,
					target: {
						offsetLeft: 100,
						offsetTop: 34
					}
				}]
			}, 12);

			callInputEventOn("touchcancel", {
				changedTouches: [{
					identifier: 1,
				}]
			}, 12);

			expect(inputMode.getCurrentState().touches).toEqual([]);
		});
	});

	describe("when a key is pressed", function() {
		it("should register the key as a single press key", function () {
			callWindowDocumentInputEvent("keypress", {which: 32}, 13);

			expect(inputMode.getCurrentState().singlePressKeys).toEqual(["space"]);
		});

		it("should remove the single press key after get the current state", function () {
			callWindowDocumentInputEvent("keypress", {which: 32}, 14);

			expect(inputMode.getCurrentState().singlePressKeys).toEqual(["space"]);
			expect(inputMode.getCurrentState().singlePressKeys).toEqual([]);
		});
	});

	describe("when a key is depressed", function() {
		it("should register the key as a key", function () {
			callWindowDocumentInputEvent("keydown", {which: 32}, 15);

			expect(inputMode.getCurrentState().keys).toEqual(["space"]);
		});

		it("should continue to register the mouse click on subsequent calls to getCurrentState", function () {
			callWindowDocumentInputEvent("keydown", {which: 32}, 16);

			expect(inputMode.getCurrentState().keys).toEqual(["space"]);
			expect(inputMode.getCurrentState().keys).toEqual(["space"]);
		});
	});

	describe("when a key is released", function() {
		it("should remove the key from the current state", function () {
			callWindowDocumentInputEvent("keydown", {which: 32});

			callWindowDocumentInputEvent("keyup", {which: 32});
			expect(inputMode.getCurrentState().keys).toNotEqual(["space"]);
		});
	});

	describe("html elements marked as keys", function () {
		it("should only work for elements with the correct div", function () {
			it("should register the touch as a key", function () {
				callInputEventOnClass(".key-tab", "touchstart", {}, 0);

				expect(inputMode.getCurrentState().keys).toEqual([]);
			});
		});

		describe("when touch is enabled in the browser", function () {
			beforeEach(function() {
				var document = jsdom("<div id=\"element\">With content.</div><div id=\"derp\" class=\"button key-space\">With content.</div><div class=\"button\">Derp</div>");
				global.window = document.parentWindow;
				global.window.ontouchstart = function() { return undefined; };
				global.getComputedStyle = function() {};
				global.document = document;

				$ = require('zepto-browserify').$;

				socket.emit.reset();

				InputMode = require('../src/input.js').func(defer(global.window), defer("element")).InputMode;
				inputMode = new InputMode(socket);
			})

			describe("when a touch press starts", function() {
				it("should register the touch as a key", function () {
					callInputEventOnClass(".key-space", "touchstart", {}, 0);

					expect(inputMode.getCurrentState().keys).toEqual(["space"]);
				});

				it("should continue to register the touch on subsequent calls to getCurrentState", function () {
					callInputEventOnClass(".key-space", "touchstart", {}, 2);

					expect(inputMode.getCurrentState().keys).toEqual(["space"]);
					expect(inputMode.getCurrentState().keys).toEqual(["space"]);
				});
			});

			describe("when a touch press finishes", function() {
				it("should remove the touch from the current state", function () {
					callInputEventOnClass(".key-space", "touchstart", {}, 2);
					callInputEventOnClass(".key-space", "touchend", {}, 2);

					expect(inputMode.getCurrentState().keys).toEqual([]);
				});
			});

			describe("when a touch press is cancelled", function() {
				it("should remove the touch from the current state", function () {
					callInputEventOnClass(".key-space", "touchstart", {}, 3);
					callInputEventOnClass(".key-space", "touchcancel", {}, 3);

					expect(inputMode.getCurrentState().keys).toEqual([]);
				});
			});

			describe("when a touch press leaves the element", function() {
				it("should remove the touch from the current state", function () {
					callInputEventOnClass(".key-space", "touchstart", {}, 4);
					callInputEventOnClass(".key-space", "touchleave", {}, 4);

					expect(inputMode.getCurrentState().keys).toEqual([]);
				});
			});
		});
	})
});