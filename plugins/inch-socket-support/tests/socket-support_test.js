var expect = require('expect');
var sinon = require('sinon');
var _ = require('lodash');

var SocketSupport = require("../src/socket-support");

var socket = {
	on: sinon.spy(),
	emit: sinon.spy()
};
var io = {
	of: function() {
		return {
			on: function(name, f) {
				f(socket);
			}
		};
	}
};
var gameState = {
	hi: "there"
};
var callbacks = {
	onPlayerConnect: sinon.spy(),
	onPlayerDisconnect: sinon.spy(),
	onPause: sinon.spy(),
	onUnpause: sinon.spy(),
	onNewUserInput: sinon.spy(),
	getGameState: function() { return gameState; }
};
var pendingAckCallback = sinon.spy();
var ackMap = {
	'first': [{target: pendingAckCallback, data: gameState}]
};
var mode = "arcade";

describe.skip("setting up the socket", function () {
	beforeEach(function () {
		sinon.spy(io, "of");
		sinon.spy(global, "setInterval");
		SocketSupport.setup(io, modeCallbacks, mode);
	});

	afterEach(function () {
		_.each(setInterval.returnValues, function(id) {
			clearInterval(id);
		});

		setInterval.restore();
		io.of.restore();
	});

	it("should listen on /:mode/primary", function () {
		expect(io.of.calledOnce).toEqual(true);
		expect(io.of.firstCall.args).toEqual(["/arcade/primary"]);
	});
});

describe.skip("on connect", function () {
	beforeEach(function () {
		socket.emit.reset();
		sinon.spy(global, "setInterval");
		SocketSupport.setup(io, callbacks, ackMap, mode);

		updateClientFunc = setInterval.firstCall.args[0];
	});

	afterEach(function () {
		_.each(setInterval.returnValues, function(id) {
			clearInterval(id);
		});

		setInterval.restore();
	});


	it("should setup the socket events", function () {
		expect(socket.on.getCall(0).args[0]).toEqual("disconnect");
		expect(socket.on.getCall(1).args[0]).toEqual("input");
		expect(socket.on.getCall(2).args[0]).toEqual("pause");
		expect(socket.on.getCall(3).args[0]).toEqual("unpause");
	});

	it("should send the initial game state to the client", function () {
		expect(socket.emit.firstCall.args).toEqual(["gameState/setup", {hi: "there"}])
	});

	it("should start the update loop", function () {
		updateClientFunc();

		expect(socket.emit.secondCall.args[0]).toEqual("gameState/update");
	});

	it("should call the onPlayerConnect callback", function () {
		expect(callbacks.onPlayerConnect.called).toEqual(true);
	});
});

describe.skip("the client update loop", function () {
	var updateClientFunc;

	beforeEach(function () {
		socket.emit.reset();
		sinon.spy(global, "setInterval");
		SocketSupport.setup(io, callbacks, ackMap, mode);

		updateClientFunc = setInterval.firstCall.args[0];
	});

	afterEach(function () {
		_.each(setInterval.returnValues, function(id) {
			clearInterval(id);
		});

		setInterval.restore();
	});

	it("should not send the packet if the game state hasn't changed", function () {
		updateClientFunc();

		expect(socket.emit.getCall(0).args[0]).toEqual("gameState/setup");
		expect(socket.emit.getCall(1).args[0]).toEqual("gameState/update");

		socket.emit.reset();
		updateClientFunc();

		expect(socket.emit.callCount).toEqual(0);
	});

	it("should send the packet if the game state has changed", function () {
		updateClientFunc();

		expect(socket.emit.getCall(0).args[0]).toEqual("gameState/setup");
		expect(socket.emit.getCall(1).args[0]).toEqual("gameState/update");

		socket.emit.reset();
		gameState.altered = true;
		updateClientFunc();

		expect(socket.emit.callCount).toEqual(1);
		expect(socket.emit.firstCall.args[0]).toEqual("gameState/update");
	});

	it("should give each packet an id", function () {
		updateClientFunc();

		expect(socket.emit.secondCall.args[0]).toEqual("gameState/update");
		expect(socket.emit.secondCall.args[1].id).toEqual(5);
	});

	it("should record the sent time of each packet", function () {
		updateClientFunc();

		expect(socket.emit.secondCall.args[1].sentTimestamp).toNotEqual(undefined);
	});

	it("should send game state about every 45ms", function() {
		expect(setInterval.firstCall.args[1]).toEqual(45);
	});
});

describe.skip("on input", function () {
	var inputData;

	beforeEach(function () {
		inputData = {
			pendingAcks: [{names: ["first"], id: 1}]
		};

		pendingAckCallback.reset();

		expect(socket.on.getCall(1).args[0]).toEqual("input");
		socket.on.getCall(1).args[1](inputData);
	});

	it("should remove pending acks from the input data", function () {
		expect(inputData.pendingAcks).toEqual(undefined);
	});

	it.skip("should calculate the latency of each packet", function () {});
	it.skip("remove ack'd packets from the unacked packet list");

	it("should call the onNewUserInput callback", function () {
		expect(callbacks.onNewUserInput.called).toEqual(true);
	});

	it("should call the pendingAck target", function () {
		expect(pendingAckCallback.called).toEqual(true);
	});

	it("should pass the ack into the pendingAck target", function () {
		expect(pendingAckCallback.firstCall.args[0]).toEqual({names: ["first"], id: 1});
	});

	it("should pass the data parameter into the pendingAck target", function () {
		expect(pendingAckCallback.firstCall.args[1]).toEqual(gameState);
	});
});

describe.skip("on pause", function () {
	beforeEach(function () {
		expect(socket.on.getCall(2).args[0]).toEqual("pause");
		socket.on.getCall(2).args[1]();
	});

	it("should call the onPause callback", function() {
		expect(callbacks.onPause.calledOnce).toEqual(true);
	});
});

describe.skip("on unpause", function () {
	beforeEach(function () {
		expect(socket.on.getCall(3).args[0]).toEqual("unpause");
		socket.on.getCall(3).args[1]();
	});

	it("should call the onUnpause callback", function () {
		expect(callbacks.onUnpause.calledOnce).toEqual(true);
	});
});

describe.skip("on disconnect", function () {
	beforeEach(function () {
		expect(socket.on.getCall(0).args[0]).toEqual("disconnect");
		socket.on.getCall(0).args[1]();
	});

	it("should call the onPlayerDisonnect callback", function () {
		expect(callbacks.onPlayerDisconnect.calledOnce).toEqual(true);
	});
});