'use strict';

var jsdom = require('jsdom').jsdom;

describe('a circle', function () {
	var circle;

	before(function(done) {
		jsdom.env({
			html: '<html><body><div id="element">With content.</div><div id="derp" class="button key-space">With content.</div><div class="button">Derp</div></body></html>',
			done: function(err, window) {
				global.window = window;
				global.getComputedStyle = function() {};

				done();
			}});
	});

	beforeEach(function () {
		var adapter = require('../../inch-plugin-render-engine-adapter-threejs/src/adapter.js');

		circle = require('../src/circle')(adapter);
	});

	it('should run without error', function () {
		circle(
			function() {},
			function() {},
			{}
		);
	});
});