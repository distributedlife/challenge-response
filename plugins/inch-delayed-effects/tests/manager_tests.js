var expect = require('expect');
var sinon = require('sinon');
var assert = require('assert');
var DelayedEffects = require("../src/manager.js").DelayedEffects;

describe('the delayed effect manager', function() {
	var effect1 = sinon.spy();
	var effect2 = sinon.spy();
	var manager;

	beforeEach(function() {
		manager = DelayedEffects();
		effect1.reset();
		effect2.reset();
	});

	it("should allow you to add multiple effects", function() {
		manager.add("key", 1, effect1);
		manager.add("key", 1, effect2);
		manager.update(1);
		assert(effect1.called);
		assert(effect2.called);
	});

	it("should update each effect", function() {
		manager.add("key", 1, effect1);
		manager.add("key", 1, effect2);
		manager.update(0.5);
		assert(!effect1.called);
		assert(!effect2.called);
		manager.update(1);
		assert(effect1.called);
		assert(effect2.called);
	});

	it("should not call dead effects", function() {
		manager.add("key", 1, effect1);
		manager.add("key", 1, effect2);
		manager.update(1);
		effect1.reset();
		effect2.reset();
		manager.update(1);
		assert(!effect1.called);
		assert(!effect2.called);
	});

	it("should be possible to cancel all effects", function() {
		manager.add("key1", 1, effect1);
		manager.add("key2", 1, effect2);
		manager.cancelAll();
		manager.update(1);
		assert(!effect1.called);
		assert(!effect2.called);
	});

	it("should be possible to cancel all effects of a certain key", function () {
		manager.add("key1", 1, effect1);
		manager.add("key2", 1, effect2);
		manager.cancelAll("key1");
		manager.update(1);
		assert(!effect1.called);
		assert(effect2.called);
	})
});