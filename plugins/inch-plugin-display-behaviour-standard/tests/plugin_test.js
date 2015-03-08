var sinon = require('sinon');
var expect = require('expect');
var jsdom = require('jsdom').jsdom;

describe("the standard display behaviour", function () {
	var DisplayBehaviour;
	var Dimensions = {
		Dimensions: function() {}
	};
	var Camera = {
		Camera: sinon.spy()
	};
	var renderer = {
		render: sinon.spy(),
		setSize: sinon.spy()
	};
	var adapter = {
		createScene: sinon.spy(),
		createRenderer: function() { return renderer; },
		attachRenderer: sinon.spy(),
		setCameraAspectRatio: sinon.spy(),
		updateProjectionMatrix: sinon.spy()
	};
	sinon.spy(adapter, "createRenderer");
	var part1 = {
		screenResized: sinon.spy(),
		setup: sinon.spy()
	};
	var part2 = {
		screenResized: sinon.spy(),
		setup: sinon.spy()
	};
	var part3 = {
		screenResized: function() {},
		setup: function(inchScene, ackLast, registerEffect, tracker, camera) {
			part3.inchScene = inchScene;
			part3.ackLast = ackLast;
			part3.registerEffect = registerEffect;
			part3.tracker = tracker;
			part3.camera = camera;
		}
	};
	var levelParts = [part1, part2, part3];
	var ackLast = sinon.spy();
	var addAck = sinon.spy();
	var tracker = {
		updateState: sinon.spy()
	};
	var behaviour;
	var dimensions = {
		usableWidth: sinon.spy(),
		usableHeight: sinon.spy()
	};

	before(function(done) {
		jsdom.env({
			html: "<div id=\"a-div\">With content.</div>",
			done: function(err, window) {
				global.window = window;
				global.getComputedStyle = function() {};

				done();
			}});
	});

	beforeEach(function() {
		ackLast.reset();
		addAck.reset();
		part1.screenResized.reset();
		part2.screenResized.reset();
		part1.setup.reset();
		part2.setup.reset();
		Camera.Camera.reset();
		adapter.createScene.reset();
		adapter.createRenderer.reset();
		adapter.attachRenderer.reset();
		renderer.render.reset();

		DisplayBehaviour = require("../src/display").func(Dimensions, Camera, adapter, "element", levelParts);
		behaviour = DisplayBehaviour.Display(ackLast, addAck);
	});

	it("should resize each level part to the current dimensions", function () {
		expect(part1.screenResized.called).toEqual(true);
		expect(part2.screenResized.called).toEqual(true);
	});

	it("should create a camera", function () {
		expect(Camera.Camera.called).toEqual(true);
	});

	it("should create a scene", function() {
		expect(adapter.createScene.called).toEqual(true);
	});

	it("should create a renderer and attach it to the dom", function() {
		expect(adapter.createRenderer.called).toEqual(true);
		expect(adapter.attachRenderer.firstCall.args).toEqual(["element", renderer])
	});

	describe("on a setup packet", function() {
		beforeEach(function () {
			behaviour.setup();
		});

		it.skip("should tell the state tracker of the new state");
		it("should call setup on each level part", function () {
			expect(part1.setup.called).toEqual(true);
			expect(part2.setup.called).toEqual(true);
		});
	});

	describe("on an update packet", function () {
		var packet;

		beforeEach(function () {
			packet = {};
		});

		it("should do nothing if the packet is old", function () {
			packet.id = -1;
			behaviour.update(packet);

			expect(tracker.updateState.called).toEqual(false);
		});

		it("is waiting for us to decide on how to mock out modules");

		it.skip("should tell the state tracker of the new packet", function () {
			packet.id = 1;
			behaviour.update(packet);

			expect(tracker.updateState.called).toEqual(true);
		});
	});

	describe("when updating the display once per frame", function () {
		var effect;

		describe("when the game is paused", function () {
			before(function () {
				effect = {
					tick: sinon.spy(),
					isAlive: function() { return true; }
				};

				behaviour.setup();
				part3.registerEffect(effect);
			});

			beforeEach(function () {
				var packet = {
					id: 100,
					paused: true
				};

				behaviour.update(packet);
				behaviour.updateDisplay();
			});

			it("should not update the effects when setup", function () {
				expect(effect.tick.called).toEqual(false);
			});
		});

		describe("when the game is not paused", function () {
			var effect;
			var expiredEffect;

			beforeEach(function () {
				var packet = {
					id: 100,
					paused: false
				};
				effect = {
					tick: sinon.spy(),
					isAlive: function() { return true; }
				};
				expiredEffect = {
					tick: sinon.spy(),
					isAlive: function() { return false; }
				};

				behaviour.update(packet);
			});

			it("should render the scene", function () {
				behaviour.setup();
				part3.registerEffect(effect);
				behaviour.updateDisplay();
				expect(renderer.render.called).toEqual(true);
			});

			describe("when the setup is complete", function () {
				beforeEach(function () {
					behaviour.setup();
					part3.registerEffect(effect);

					behaviour.updateDisplay();
				});

				it("should update the effects", function () {
					expect(effect.tick.called).toEqual(true);
				});

				it("should remove all expired effects from the being updated", function () {
					effect.tick.reset();
					expiredEffect.tick.reset();

					behaviour.updateDisplay();

					expect(effect.tick.called).toEqual(true);
					expect(expiredEffect.tick.called).toEqual(false);
				});
			});

			describe("when the setup is not complete", function () {
				beforeEach(function () {
					behaviour.updateDisplay();
				});

				it("should not update the effects", function () {
					expect(effect.tick.called).toEqual(false);
				});
			});
		});
	});

	describe("when told to resize", function () {
		beforeEach(function () {
			behaviour.resize(dimensions);
		});

		it("should update the renderer size", function () {
			expect(renderer.setSize.called).toEqual(true);
		});

		it("should update the camera aspect ratio", function () {
			expect(adapter.setCameraAspectRatio.called).toEqual(true);
		});

		it("should tell each level part to resize", function () {
			expect(part1.screenResized.called).toEqual(true);
			expect(part2.screenResized.called).toEqual(true);
		});
	});
});