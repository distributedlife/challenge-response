var expect = require('expect');

var sequence = require('../src/sequence.js');

describe("a new sequence", function() {
	it("should start the sequence with 1", function() {
		expect(sequence.next("key")).toBe(1)
	});
});

describe("an existing sequence", function() {
	it("should increment the sequence", function() {
		expect(sequence.next("key")).toBe(2);
	})

	it("should not clash with other keys", function() {
		expect(sequence.next("derp")).toBe(1);
	})
});

describe("checking if a key exists", function() {
	it("should return true if a key exists", function() {
		expect(sequence.exists("key")).toBe(true);
	});

	it("should return false if the key does not exist", function() {
		expect(sequence.exists("saturday")).toBe(false);
	});
})