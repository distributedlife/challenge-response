var requirejs = require('requirejs');
requirejs.config({ baseUrl: 'inch/public/js' });

var track_state_changes = requirejs('framework/track_state_changes');
var value = function(name) { return function(state) { return state[name]; }; };

describe("Track State Changes", function() {
	describe("when there is no prior state", function() {
		beforeEach(function() {
			track_state_changes.prior_state = null;
			track_state_changes.current_state = {node: { a: 'a'}};
		});

		it("it should report changed as true", function() {
			expect(track_state_changes.changed(value('node'))).toBeTruthy();
		});

		it("it should report property changes as true", function() {
			expect(track_state_changes.property_changed(value('node'), value('a'))).toBeTruthy();
		});

		it("it should report changed strict as false", function() {
			expect(track_state_changes.changed_strict(value('node'))).toBeFalsy();
		});
	});

	// describe('updating state');

	describe("when the current state has not changed yet", function() {
		beforeEach(function() {
			track_state_changes.prior_state = {node: { a: 'a'}, flat: "flat"};
			track_state_changes.current_state = {node: { a: 'a'}, flat: "flat"};
		});

		it("it should report changed as false", function() {
			expect(track_state_changes.changed(value('node'))).toBeFalsy();
			expect(track_state_changes.changed(value('flat'))).toBeFalsy();
		});

		it("it should report property changes as false", function() {
			expect(track_state_changes.property_changed(value('node'), value('a'))).toBeFalsy();
		});

		it("it should report changed strict as false", function() {
			expect(track_state_changes.changed_strict(value('node'))).toBeFalsy();
		});
	});

	describe("whene the current state has changed from the prior state", function() {
		beforeEach(function() {
			track_state_changes.prior_state = {node: { a: 'a'}, flat: "flat"};
			track_state_changes.current_state = {node: { a: 'b'}, flat: "undulating"};
		});

		it("it should report changed as true", function() {
			expect(track_state_changes.changed(value('node'))).toBeTruthy();
			expect(track_state_changes.changed(value('flat'))).toBeTruthy();
		});

		it("it should report property changes as true", function() {
			expect(track_state_changes.property_changed(value('node'), value('a'))).toBeTruthy();
		});

		it("it should report changed strict as true", function() {
			expect(track_state_changes.changed_strict(value('node'))).toBeTruthy();
		});
	});
});