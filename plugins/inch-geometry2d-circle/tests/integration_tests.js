var expect = require('expect');
var jsdom = require('jsdom').jsdom;
var _ = require('lodash');

var document = jsdom("<div id=\"a-div\">With content.</div>");
global.window = document.parentWindow;
global.getComputedStyle = function() {};
global.document = document;
global.self = {};

var adapter = require('../../inch-plugin-render-engine-adapter-threejs/src/adapter.js').func();

describe("a circle", function () {
	var circle;

	beforeEach(function () {
		circle = require("../src/circle")(adapter);
	});

	it("should run without error", function () {
		circle(
			function() {},
			function() {},
			{}
		);
	});
});