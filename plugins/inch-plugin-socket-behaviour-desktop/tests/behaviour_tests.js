var expect = require('expect');
var sinon = require('sinon');
var _ = require('lodash');
var jsdom = require('jsdom').jsdom;

var socket = {
	on: sinon.spy(),
	emit: sinon.spy()
}

var $;

var io = require('socket.io-client');
io.connect = function () { return socket; };
var ConnectDisconnectBehaviour = {
	connected: sinon.spy(),
	disconnected: sinon.spy()
};
var InputModes = [
	{ InputMode: function(socket) { return { getCurrentState: function() { return { "a": "a" }; }}}},
	{ InputMode: function(socket) { return { getCurrentState: function() { return { "b": { "c": "c" } }; }}}}
];
var GameMode = "arcade";
var serverUrl = "http://localhost:3000/"
var flushPendingAcksFunc = function() { return [1, 2, 3]; };
var setupFunc = sinon.spy();
var updateFunc = sinon.spy();
var Behaviour;

var defer = function(dep) {
	return function() {
		return dep;
	};
};

describe("desktop socket behaviour", function () {
	beforeEach(function (done) {
		var html = "<html><body><div id=\"element\">With content.</div></body></html>";
	  jsdom.env({
	    html: html,
	    done: function(err, window) {
	      global.window = window;
	      global.getComputedStyle = function() {};
	      global.self = {};
	      global.window.document.hasFocus = function () { return false; };

	      $ = require('zepto-browserify').$;

				Behaviour = require("../src/behaviour").func(defer(window), defer(ConnectDisconnectBehaviour), defer(InputModes), defer(GameMode), defer(serverUrl));

	      done();
    }});

		sinon.spy(io, "connect");
		sinon.spy(global, "setInterval");
		socket.emit.reset();
		socket.on.reset();
	});

	afterEach(function () {
		_.each(setInterval.returnValues, function(id) {
			clearInterval(id);
		});

		io.connect.restore();
		setInterval.restore();
	});

	it("should connect to /:mode/primary on localhost", function () {
		Behaviour.SocketBehaviour(flushPendingAcksFunc).connect(setupFunc, updateFunc);

		expect(io.connect.firstCall.args[0]).toEqual('http://localhost:3000/arcade/primary');
	});

	it("if the window has focus when we connect; unpause", function () {
		global.window.document.hasFocus = function () { return true; }
		Behaviour.SocketBehaviour(flushPendingAcksFunc).connect(setupFunc, updateFunc);

		expect(socket.emit.firstCall.args[0]).toEqual('unpause');
	});

	it("if the window does not have focus when we connect; don't send an unpause event", function () {
		global.window.document.hasFocus = function () { return false; }
		Behaviour.SocketBehaviour(flushPendingAcksFunc).connect(setupFunc, updateFunc);

		expect(socket.emit.called).toEqual(false);
	});

	it("should forward the connect event to the ConnectDisconnectBehaviour plugin", function () {
		Behaviour.SocketBehaviour(flushPendingAcksFunc).connect(setupFunc, updateFunc);

		expect(socket.on.firstCall.args).toEqual(["connect", ConnectDisconnectBehaviour.connected]);
	});

	it("should forward the disconnect event to the ConnectDisconnectBehaviour plugin", function () {
		Behaviour.SocketBehaviour(flushPendingAcksFunc).connect(setupFunc, updateFunc);

		expect(socket.on.secondCall.args).toEqual(["disconnect", ConnectDisconnectBehaviour.disconnected]);
	});

	it("should forward the game state setup event to the supply setup callback", function () {
		Behaviour.SocketBehaviour(flushPendingAcksFunc).connect(setupFunc, updateFunc);

		expect(socket.on.getCall(2).args).toEqual(["gameState/setup", setupFunc]);
	});

	it("should forward the game state update event to the supply update callback", function () {
		Behaviour.SocketBehaviour(flushPendingAcksFunc).connect(setupFunc, updateFunc);

		expect(socket.on.getCall(3).args).toEqual(["gameState/update", updateFunc]);
	});

	it("should configure the emit function to run 120 times second", function () {
		Behaviour.SocketBehaviour(flushPendingAcksFunc).connect(setupFunc, updateFunc);

		expect(global.setInterval.firstCall.args[1]).toEqual(1000 / 120);
	});
});

describe("events", function () {
	beforeEach(function () {
		socket.emit.reset();
	});

	var document = function() {
		return global.window.document;
	};

	var makeFakeEvent = function(klass, type, options) {
		var event = new document().createEvent(klass);
		event.initEvent(type, true, true);
    event = _.defaults(event, options);

    return event;
	};

	describe("when the window loses focus", function() {
		it("should send a pause event", function () {
			document().dispatchEvent(makeFakeEvent("WindowEvent", "blur"));

			expect(socket.emit.firstCall.args[0]).toEqual("pause");
		});
	});

	describe("when the window gains focus", function() {
		it("should send an unpause event", function () {
			document().dispatchEvent(makeFakeEvent("WindowEvent", "focus"));

			expect(socket.emit.firstCall.args[0]).toEqual("unpause");
		});
	});

	describe("when the mouse button is pressed", function() {
		it("should send an unpause event", function () {
			document().dispatchEvent(makeFakeEvent("MouseEvent", "mouseup", {which: 1}));

			expect(socket.emit.firstCall.args[0]).toEqual("unpause");
		});
	});

	describe("when the mouse button is released", function() {
		it("should send an unpause event", function () {
			document().dispatchEvent(makeFakeEvent("MouseEvent", "mousedown", {which: 1}));

			expect(socket.emit.firstCall.args[0]).toEqual("unpause");
		});
	});
});

describe("sending input events to the server", function () {
	var emitFunc;
	var packet;
	var clock;

	before(function() {
		clock = sinon.useFakeTimers();
		sinon.spy(io, "connect");
		sinon.spy(global, "setInterval");


		Behaviour.SocketBehaviour(flushPendingAcksFunc).connect(setupFunc, updateFunc);
		emitFunc = global.setInterval.firstCall.args[0];
	});

	beforeEach(function () {
		socket.emit.reset();
		emitFunc();
		packet = socket.emit.firstCall.args[1];
	});

	after(function () {
		_.each(setInterval.returnValues, function(id) {
			clearInterval(id);
		});

		setInterval.restore();
		clock.restore();
		io.connect.restore();
	});

	it("should add the current input state from each InputMode to the current packet", function () {
		expect(packet.a).toEqual("a");
		expect(packet.b).toEqual({"c": "c"});
	});

	it("should add all pending acks to the packet", function () {
		expect(packet.pendingAcks).toEqual([1,2,3]);
	});

	it("should put the sent timestamp on the packet", function () {
		expect(packet.sentTimestamp).toEqual(Date.now());
	});

	it("should send the packet", function () {
		expect(socket.emit.called).toEqual(true);
		expect(socket.emit.firstCall.args[0]).toEqual("input");
	});
});