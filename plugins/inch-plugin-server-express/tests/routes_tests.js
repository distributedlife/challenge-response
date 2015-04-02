"use strict";

var expect = require('expect');
var sinon = require('sinon');
var request = require('request');

var deferDep = require('../../../tests/helpers.js').deferDep;
var socketSupport = {
	start: sinon.spy(),
	stop: sinon.spy()
};

describe('configuring the routes', function () {
	var io;
	var callbacks = {
		arcade: sinon.spy()
	};
	var server;

	before(function() {
		io = require('socket.io');
		io.listen = sinon.spy();
		io.of = sinon.spy();

		server = require('../src/js/server').func(deferDep(socketSupport));
		server.start('../dummy', callbacks);
	});

	after(function () {
		server.stop();
	});

	describe('when the modes object is not a hash', function () {

	});

	it('should redirect to the root page when the mode is not in the callbacks', function (done) {
		request({
			followRedirect: function(res) {
				expect(res.statusCode).toEqual(302);
				expect(res.headers.location).toEqual('/');
			},
			uri: 'http://localhost:3000/derp/primary'
		}, function () {
			done();
		}).end();
	});

	it.skip('should invoke the callback specified by the mode', function (done) {
		request.get('http://localhost:3000/arcade/primary', function (err, res, body) {
			expect(res.statusCode).toEqual(200);
			expect(callbacks.arcade.called).toEqual(true);
			done();
		}).end();
	});

	describe('each of the default routes', function () {
		it('the "primary" view', function (done) {
			request.get('http://localhost:3000/arcade/primary', function (err, res, body) {
				expect(res.statusCode).toEqual(200);
				done();
			}).end();
		});
	});
});