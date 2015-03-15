var expect = require('expect');
var jsdom = require('jsdom').jsdom;
var _ = require('lodash');

describe("the geometry base", function () {
	var geometry;

  before(function(done) {
    jsdom.env({
      html: "<html><body><div id=\"element\">With content.</div><div id=\"derp\" class=\"button key-space\">With content.</div><div class=\"button\">Derp</div></body></html>",
      done: function(err, window) {
        global.window = window;
        global.getComputedStyle = function() {};
        global.self = {};

        done();
      }});
  });

	beforeEach(function () {
    var adapter = require('../../inch-plugin-render-engine-adapter-threejs/src/adapter.js').func();
    var font = require('../../inch-font-helvetiker_regular/src/regular.js').func(adapter).load();

		geometry = require("../src/geometry")(adapter);
	});

	it("should call the adapter correctly", function () {
		geometry.materials.basic(geometry.defaults());
		geometry.geometries.circle(geometry.defaults());
		geometry.geometries.text(geometry.defaults());
		geometry.mesh.assemble(
			geometry.geometries.circle,
			geometry.materials.basic,
			function () { return {x:0, y:0, z:0}; },
			function () { return undefined; },
			geometry.defaults()
		);
	});
});

describe("the defaults module", function() {
	var defaults;
  var adapter;

  before(function(done) {
    jsdom.env({
      html: "<html><body><div id=\"element\">With content.</div><div id=\"derp\" class=\"button key-space\">With content.</div><div class=\"button\">Derp</div></body></html>",
      done: function(err, window) {
        global.window = window;
        global.getComputedStyle = function() {};

        done();
      }});
  });

	beforeEach(function () {
    adapter = require('../../inch-plugin-render-engine-adapter-threejs/src/adapter.js').func();

		defaults = require("../src/defaults")(adapter);
	});

	it("should set up sensible defaults", function () {
		expect(defaults().transparent).toBe(false);
		expect(defaults().alphaTest).toBe(0.1);
    expect(defaults().blending).toBe(adapter.getAdditiveBlendingConstant());
    expect(defaults().size).toBe(200);
    expect(defaults().duration).toBe(0);
    expect(defaults().alignment.horizontal).toBe("centre");
    expect(defaults().alignment.vertical).toBe("centre");
    expect(defaults().scale).toBe(1.0);
    expect(defaults().colour).toEqual([1.0, 1.0, 1.0]);
    expect(defaults().opacity).toBe(1.0);
    expect(defaults().position).toEqual({x: 0, y: 0, z: 0});
    expect(defaults().startHidden).toBe(false);
	});

	it("should allow all values to be overriden", function () {
		var options = {
			transparent: true,
			alphaTest: 0.9,
			blending: 50,
			size: 10,
			duration: 10,
			alignment: {
				horizontal: "left",
				vertical: "right"
			},
			scale: 2.0,
			colour: [0, 0, 0],
			opacity: 0.3,
			position: {x: 1, y: 2, z: 3}
		};

		expect(defaults(_.clone(options)).transparent).toBe(true);
		expect(defaults(_.clone(options)).alphaTest).toBe(0.9);
    expect(defaults(_.clone(options)).blending).toBe(50);
    expect(defaults(_.clone(options)).size).toBe(100);
    expect(defaults(_.clone(options)).duration).toBe(10);
    expect(defaults(_.clone(options)).alignment.horizontal).toBe("left");
    expect(defaults(_.clone(options)).alignment.vertical).toBe("right");
    expect(defaults(_.clone(options)).scale).toBe(2.0);
    expect(defaults(_.clone(options)).colour).toEqual([0, 0, 0]);
    expect(defaults(_.clone(options)).opacity).toBe(0.3);
    expect(defaults(_.clone(options)).position).toEqual({x: 1, y: 2, z: 3});
	});

	it("should set transparent to false and opacity to zero when start hidden", function () {
		expect(defaults({startHidden: true}).transparent).toBe(true);
		expect(defaults({startHidden: true}).opacity).toBe(0);
	});
});