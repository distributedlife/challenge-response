var expect = require('expect');
var assert = require('assert');
var sinon = require('sinon');

var Engine = require('../src/engine.js')

describe("the engine", function() {
	var engine = null;
	var paused = false;
	var isPaused = function() { return paused; };
	var thing = {
		update: sinon.spy()
	};

	var now = 1000000;
	var clock = undefined;

	beforeEach(function() {
		thing.update.reset();

		clock = sinon.useFakeTimers();
		now = Date.now();

		engine = new Engine(isPaused, thing.update);
	});

	afterEach(function() {
		clock.restore();
	})

	describe("when unpaused", function() {
		it("should call each function passed in with the delta in ms", function() {
			var prior_step = now - 5000;
			engine.step(prior_step);
			assert(thing.update.calledWith(5));
		});
	});

	describe("when paused", function() {
		it("it should not call any update functions", function() {
			paused = true;
			engine.step();
			assert(!thing.update.called);
		});
	});
});