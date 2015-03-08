var expect = require('expect');
var window = {
	innerWidth: 1000,
	innerHeight: 400
}

var Dimensions = require("../src/dimensions").func(2.6, 32, window).Dimensions;

describe('dimensions', function() {
	it("should get the screen width", function() {
		expect(Dimensions().screenWidth).toBe(1000);
	});

	it("should get the screen height", function() {
		expect(Dimensions().screenHeight).toBe(400);
	});

	it("should determine orientation correctly", function() {
		expect(Dimensions().orientation).toBe("portrait");
	});

	it("should calculate the maximum usable height and width to create a space that will fit preserving aspect ration", function() {
		expect(Dimensions().usableWidth).toBe(1040);
		expect(Dimensions().usableHeight).toBe(336);
	});
});