var expect = require('expect');
var sinon = require('sinon');
var request = require('request');

describe("configuring the routes", function () {
	var routes;
	var callbacks = {
		arcade: sinon.spy()
	};
	var server;

	before(function() {
		io = require('socket.io');
		io.listen = sinon.spy();

		server = require("../src/js/server").Server("../dummy", callbacks);
		server.start();
	});

	after(function () {
		server.stop();
	});

	it("should redirect to the root page when the mode is not in the callbacks", function (done) {
		request({
			followRedirect: function(res) {
				expect(res.statusCode).toEqual(302);
				expect(res.headers.location).toEqual('/');
			},
			uri: "http://localhost:3000/derp/primary"
		}, function (err, res, body) {
			done();
		}).end();
	});

	it("should invoke the callback specified by the mode", function (done) {
		request.get("http://localhost:3000/arcade/primary", function (err, res, body) {
			expect(res.statusCode).toEqual(200);
			expect(callbacks.arcade.called).toEqual(true);
			done();
		}).end();
	});

	describe("each of the default routes", function () {
		it("the 'primary' view", function (done) {
			request.get("http://localhost:3000/arcade/primary", function (err, res, body) {
				expect(res.statusCode).toEqual(200);
				done();
			}).end();
		});
	});
});