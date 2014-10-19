var requirejs = require('requirejs');
requirejs.config({ baseUrl: 'inch/public/js' });

var bounding_box = requirejs('lib/physics/bounding_box');

describe("Bounding Box", function() {
	var parent = {};
	var parent2 = {};

	it("should have a correct bounds", function() {
		var bb = new bounding_box(parent, 8, 4, 100, 40);
		expect(bb.left()).toBe(-42);
		expect(bb.right()).toBe(58);
		expect(bb.top()).toBe(-16);
		expect(bb.bottom()).toBe(24);
	});

	it("should not collide with itself", function() {
		var bb = new bounding_box(parent, 8, 4, 100, 40);
		expect(bb.is_colliding_with(bb)).toBeFalsy();
	});

	it("should not collide with itself if it shares the same parent", function() {
		var bb = new bounding_box(parent, 8, 4, 100, 40);
		var cc = new bounding_box(parent, 8, 4, 100, 40);
		expect(bb.is_colliding_with(cc)).toBeFalsy();
	});

	it("should not collide with things to the right of it", function() {
		var bb1 = new bounding_box(parent, 50, 50, 10, 10);
		var bb2 = new bounding_box(parent2, 100, 50, 10, 10);
		expect(bb1.is_colliding_with(bb2)).toBeFalsy();
	});

	it("should not collide with things to the left of it", function() {
		var bb1 = new bounding_box(parent, 50, 50, 10, 10);
		var bb2 = new bounding_box(parent2, 0, 50, 10, 10);
		expect(bb1.is_colliding_with(bb2)).toBeFalsy();
	});

	it("should not collide with things to the above of it", function() {
		var bb1 = new bounding_box(parent, 50, 50, 10, 10);
		var bb2 = new bounding_box(parent2, 50, 100, 10, 10);
		expect(bb1.is_colliding_with(bb2)).toBeFalsy();
	});

	it("should not collide with things to the below of it", function() {
		var bb1 = new bounding_box(parent, 50, 50, 10, 10);
		var bb2 = new bounding_box(parent2, 50, 0, 10, 10);
		expect(bb1.is_colliding_with(bb2)).toBeFalsy();
	});

	it("should collide with things inside it", function() {
		var bb1 = new bounding_box(parent, 50, 50, 10, 10);
		var bb2 = new bounding_box(parent2, 50, 50, 5, 5);
		expect(bb1.is_colliding_with(bb2)).toBeTruthy();
	});
});