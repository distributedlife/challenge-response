var expect = require('expect');
var sinon = require('sinon');
var assert = require('assert');
var temporary_effect = require('../src/temporary_effect')

describe("Temporary Effect", function() {
	var effect = {};
	var progress = 0;
	var tick_tock = function(dt, p) {
		progress = p;
	};
	var on_call_function = sinon.spy();
	var on_death_function = sinon.spy();

	beforeEach(function () {
		on_call_function.reset();
		on_death_function.reset();
		progress = 0;

		effect = Object.create(temporary_effect(10, tick_tock));
	});

	describe("each tick", function() {
		it("should increase it's age", function() {
			effect.tick(5);
			expect(progress).toBe(0.5);
			effect.tick(2.5);
			expect(progress).toBe(0.75);
		});

		it("should call it's 'on tick function'", function() {
			effect = Object.create(temporary_effect(10, on_call_function));
			effect.tick(5);
			assert(on_call_function.called);
		});
	});

	describe("being alive", function () {	
		it("should start with a progress of zero", function() {
			expect(progress).toBe(0);
		});

		it("should be alive when the age is less than the duration", function() {
			effect.tick(5);
			assert(effect.isAlive());
			effect.tick(5);
			assert(!effect.isAlive());
		});

		it("should be alive when the duration is zero", function () {
			effect = Object.create(temporary_effect(0, on_call_function));
			assert(effect.isAlive());
			effect.tick(5);
			assert(effect.isAlive());
			effect.tick(5);
			assert(effect.isAlive());
		});
	});

	describe("on death", function() {
		it("should call the onDeath function once", function() {
			effect = Object.create(temporary_effect(10, undefined, on_death_function));
			effect.tick(5);
			assert(!on_death_function.called);
			effect.tick(5);
			assert(on_death_function.called);

			on_death_function.reset();
			effect.tick(5);
			assert(!on_death_function.called);
		});
	});
});