var expect = require('expect');
var PendingAcks = require("../src/index.js")();

describe("pending acknowledgements", function() {
	it("should allow me to add each packet as it arrives", function() {
		PendingAcks.add("1");

		var acks = PendingAcks.flush();
		expect(acks.length).toBe(1);
		expect(acks[0].id).toBe("1");
	});

	it("should allow me to ack the last packet", function() {
		PendingAcks.add("1");
		PendingAcks.ackLast("ZOMG");

		var acks = PendingAcks.flush();
		expect(acks[0].names).toEqual(["ZOMG"])
	});

	it("should return all packets when flush is called", function() {
		PendingAcks.add("1");
		PendingAcks.add("2");
		PendingAcks.add("3");

		var acks = PendingAcks.flush();
		expect(acks.length).toBe(3);
	});

	it("should remove all unacked packets when flush is called", function() {
		PendingAcks.add("1");
		PendingAcks.add("2");
		PendingAcks.add("3");

		PendingAcks.flush();
		expect(PendingAcks.flush().length).toBe(0);
	});
})