var expect = require('expect');
var sinon = require('sinon');
var assert = require('assert');

var Tracker = require('../src/tracker').Tracker;
var the = require('../src/tracker').The;
var to = require('../src/tracker').To;
var from = require('../src/tracker').From;
var within = require('../src/tracker').Within;
var equals = require('../src/tracker').Equals;

describe("working with property", function () {
	var callback = sinon.spy();

	beforeEach(function () {
		callback.reset();
		tracker = Tracker();
	});

	describe("when a property changes", function() {
		beforeEach(function () {
			tracker.updateState({property: "unchanged"});
			tracker.onChangeOf(the("property"), callback, "data");
		});

		it("should invoke the callback when the change occurs", function() {
			tracker.updateState({property: "changed"});
			assert(callback.calledOnce);
		});

		it("should not invoke the callback when the thing does not change", function () {
			tracker.updateState({property: "unchanged"});
			expect(callback.calledOnce).toBe(false);
		});

		it("should pass the old and new values of the thing and the data to the callback", function() {
			tracker.updateState({property: "changed"});
			expect(callback.firstCall.args).toEqual(["changed", "unchanged", "data"]);
		});
	});

	describe("when there is no prior state", function() {
		beforeEach(function () {
			tracker.onChangeOf(the("property"), callback, "data");
		});

		it("should invoke the callback when the change occurs", function() {
			tracker.updateState({property: "changed"});
			assert(callback.calledOnce);
		});

		it("should pass the old and new values of the thing and the data to the callback", function() {
			tracker.updateState({property: "changed"});
			expect(callback.firstCall.args).toEqual(["changed", undefined, "data"]);
		});
	});

	describe("when detecting a change to a particular value", function() {
		beforeEach(function () {
			tracker.updateState({property: "unchanged"});
			tracker.onChangeTo(the("property"), equals("changed"), callback, "data");
		});

		it("should invoke the callback when the change occurs", function() {
			tracker.updateState({property: "changed"});
			assert(callback.calledOnce);
		});

		it("should not invoke the callback when the thing does not change to the correct state", function () {
			tracker.updateState({property: "other"});
			expect(callback.calledOnce).toBe(false);
		});

		it("should pass the old and new values of the thing and the data to the callback", function() {
			tracker.updateState({property: "changed"});
			expect(callback.firstCall.args).toEqual(["changed", "unchanged", "data"]);
		});

		it("should call the callback immediately if the state is already true", function() {
			callback.reset();
			tracker.onChangeTo(the("property"), equals("unchanged"), callback, "data");
			assert(callback.calledOnce);
		});
	});
});

describe("working with objects", function () {
	var callback = sinon.spy();

	beforeEach(function () {
		callback.reset();
		tracker = Tracker();
	});

	describe("when the object changes", function() {
		beforeEach(function () {
			tracker.updateState({obj: {child: "value"}});
			tracker.onChangeOf(the("obj"), callback, "data");
		});

		it("should invoke the callback when the change occurs", function() {
			tracker.updateState({obj: {child: "newValue"}});
			assert(callback.calledOnce);
		});

		it("should not invoke the callback when the thing does not change", function () {
			tracker.updateState({obj: {child: "value"}});
			expect(callback.calledOnce).toBe(false);
		});

		it("should pass the old and new values of the thing and the data to the callback", function() {
			tracker.updateState({obj: {child: "newValue"}});
			expect(callback.firstCall.args).toEqual([{ child: "newValue"}, { child: "value"}, "data"]);
		});
	});

	describe("when there is no prior state", function() {
		beforeEach(function () {
			tracker.onChangeOf(the("obj"), callback, "data");
		});

		it("should invoke the callback when the change occurs", function() {
			tracker.updateState({obj: {child: "newValue"}});
			assert(callback.calledOnce);
		});

		it("should pass the old and new values of the thing and the data to the callback", function() {
			tracker.updateState({obj: {child: "newValue"}});
			expect(callback.firstCall.args).toEqual([{ child: "newValue"}, undefined, "data"]);
		});
	});

	describe("when detecting a change to a particular value", function() {
		beforeEach(function () {
			tracker.updateState({obj: {child: "value"}});
			tracker.onChangeTo(the("obj"), equals({child: "newValue"}), callback, "data");
		});

		it("should invoke the callback when the change occurs", function() {
			tracker.updateState({obj: {child: "newValue"}});
			assert(callback.calledOnce);
		});

		it("should not invoke the callback when the thing does not change to the desired state", function () {
			tracker.updateState({obj: {child: "otherValue"}});
			expect(callback.calledOnce).toBe(false);
		});

		it("should pass the old and new values of the thing and the data to the callback", function() {
			tracker.updateState({obj: {child: "newValue"}});
			expect(callback.firstCall.args).toEqual([{ child: "newValue"}, { child: "value"}, "data"]);
		});

		it("should call the callback immediately if the state is already true", function() {
			callback.reset();
			tracker.onChangeTo(the("obj"), equals({child: "value"}), callback, "data");
			assert(callback.calledOnce);
		});
	});
});

describe("working with arrays", function () {
	var callback = sinon.spy();
	var callback2 = sinon.spy();

	beforeEach(function () {
		callback.reset();
		callback2.reset();
		tracker = Tracker();
	});

	describe("when an element is added", function() {
		beforeEach(function() {
			tracker.updateState({ numbers: [] });
			tracker.onElementAdded(to("numbers"), callback, callback2, "data");
			tracker.updateState({ numbers: [{id: 1, value: "7"}] });
		});

		it("should invoke the callback with the new element and the data", function() {
			assert(callback.calledOnce)
			expect(callback.firstCall.args).toEqual([{id: 1, value: "7"}, undefined, "data"]);
		});

		it("should accept a second callback that is invoked when there are elements already in the array", function() {
			callback2.reset();
			tracker = Tracker();
			tracker.updateState({ numbers: [{id: 1, value: "7"}] });
			tracker.onElementAdded(to("numbers"), callback, callback2, "data");
			assert(callback2.calledOnce)
			expect(callback2.firstCall.args).toEqual([[{id: 1, value: "7"}], undefined, "data"]);
		});
	});

	describe("when an element is removed", function() {
		beforeEach(function() {
			tracker.updateState({ numbers: [{id: 1, value: "7"}] });
			tracker.onElementRemoved(from("numbers"), callback, "data");
			tracker.updateState({ numbers: [] });
		});

		it("should invoke the callback with the removed element and the data", function() {
			assert(callback.calledOnce)
			expect(callback.firstCall.args).toEqual([undefined, {id: 1, value: "7"}, "data"]);
		});
	});

	describe("when an element is changed", function() {
		beforeEach(function() {
			tracker.updateState({ numbers: [{id: 1, value: "6"}] });
			tracker.onElementChanged(within("numbers"), callback, "data");
			tracker.updateState({ numbers: [{id: 1, value: "7"}] });
		});

		it("should invoke the callback with the removed element and the data", function() {
			assert(callback.calledOnce)
			expect(callback.firstCall.args).toEqual([{id: 1, value: "7"}, {id: 1, value: "6"}, "data"]);
		});

		it("should not invoke the callback when nothing has changed", function() {
			callback.reset()
			tracker.updateState({ numbers: [{id: 1, value: "7"}] });
			expect(callback.called).toEqual(false);
		});
	});
});

describe("getting the current value", function () {
	it("should return the current value", function() {
		tracker.updateState({property: "unchanged"});
		expect(tracker.get(the("property"))).toEqual("unchanged");
	});
});