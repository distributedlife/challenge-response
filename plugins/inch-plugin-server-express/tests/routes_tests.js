var expect = require('expect');
var sinon = require('sinon');
var http = require('http');
var _ = require('lodash');

describe("configuring the routes", function () {
	var routes;
	var callbacks = {
		arcade: sinon.spy()
	};
	var server;

	before(function() {
		server = require("../src/js/server").Server("../dummy", callbacks);
		server.start();
	});

	after(function () {
		server.stop();
	})

	it("should redirect to the root page when the mode is not in the callbacks", function (done) {
		http.request("http://localhost:3000/derp/primary", function (res) {
			expect(res.statusCode).toEqual(302);
			expect(res.headers.location).toEqual('/');
			done();
		}).end();
	});

	it("should invoke the callback specified by the mode", function (done) {
		http.request("http://localhost:3000/arcade/primary", function (res) {
			expect(res.statusCode).toEqual(200);
			expect(callbacks.arcade.called).toEqual(true);
			done();
		}).end();
	});

	it("should setup a route for each of the supplied pages", function (done) {
		pages = ['primary'];

		_.each(pages, function (page) {
			http.request("http://localhost:3000/arcade/" + page, function (res) {
				expect(res.statusCode).toEqual(200);
			}).end();
		});

		done();
	});
});