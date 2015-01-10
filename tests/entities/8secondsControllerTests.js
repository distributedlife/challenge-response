expect = require('expect');
sinon = require('sinon');

describe("when ready", function() {
	describe("when the player responds", function () {
		it("should move the state to waiting");
		it("should roll up an unnerving delay");
	});

	describe("when the player resets", function () {
		it("should do nothing");
	});
});

describe("when waiting", function () {
	describe("when the player responds", function () {
		it("should false start");
		it("should increase the number of attempts");
	});

	describe("when the player resets", function () {
		it("should do nothing");
	});
});

describe("when the challenge has started", function() {
	describe("when the player responds", function () {
		it("should complete the challenge");
		it("should calculate the score");
		it("should increase the total");
		it("should increase the number of attempts");
	});

	describe("when the player resets", function () {
		it("should do nothing");
	});
});

describe("when the challenge is complete", function() {
	describe("when the player responds", function () {
		it("should do nothing");
	});

	describe("when the player resets", function () {
	});

	describe("when the total is less than 8000", function () {

	});

	describe("when the total is greater than or equal to 8000", function () {

	});
});

describe("when the player has false started", function () {
	describe("when the player responds", function () {
		it("should do nothing");
	});

	describe("when the player resets", function () {
	});
});

describe("when the game is over", function () {
	describe("when the player responds", function () {
		it("should do nothing");
	});

	describe("when the player resets", function () {
	});
});