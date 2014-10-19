var requirejs = require('requirejs');
requirejs.config({ baseUrl: 'inch/public/js' });

var temporary_effect = requirejs('lib/util/temporary_effect')

describe("Temporary Effect", function() {
	var effect = {};
	var progress = 0;
	var tick_tock = function(dt, p) {
		progress = p;
	};
	var on_call_function = jasmine.createSpy();

	beforeEach(function () {
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
			expect(on_call_function).toHaveBeenCalled();
		});
	});

	describe("being alive", function () {	
		it("should start with a progress of zero", function() {
			expect(progress).toBe(0);
		});

		it("should be alive when the age is less than the duration", function() {
			effect.tick(5);
			expect(effect.is_alive()).toBeTruthy();
			effect.tick(5);
			expect(effect.is_alive()).toBeFalsy();
		});

		it("should be alive when the duration is zero", function () {
			effect = Object.create(temporary_effect(0, on_call_function));
			expect(effect.is_alive()).toBeTruthy();
			effect.tick(5);
			expect(effect.is_alive()).toBeTruthy();
			effect.tick(5);
			expect(effect.is_alive()).toBeTruthy();
		});
	});
});