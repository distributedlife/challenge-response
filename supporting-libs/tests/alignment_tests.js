'use strict';

var alignment = require('../src/alignment');
var expect = require('expect');
var width = 100;
var height = 50;
var position = {x: 100, y: 100};
var options = {horizontal: undefined, vertical: undefined};

describe('Alignment', function() {
	describe('when aligning to self', function() {
		describe('when horizontal alignment is left', function() {
			beforeEach(function() {
				options.horizontal = 'left';
			});

			it ('should return a position with the left of the object at the position', function () {
				expect(alignment.toSelf2d(position, width, height, options).x).toBe(100);
			});
		});

		describe('when horizontal alignment is right', function() {
			beforeEach(function() {
				options.horizontal = 'right';
			});

			it ('should return a position with the right of the object at the position', function() {
				expect(alignment.toSelf2d(position, width, height, options).x).toBe(0);
			});
		});

		describe('when horizontal alignment is not left or right', function() {
			beforeEach(function() {
				options.horizontal = 'derp';
			});

			it ('should return a position with the centre of the object over the position', function() {
				expect(alignment.toSelf2d(position, width, height, options).x).toBe(50);
			});
		});

		describe('when vertical alignment is top', function() {
			beforeEach(function() {
				options.vertical = 'top';
			});

			it ('should return a position with the top of the object at the position', function () {
				expect(alignment.toSelf2d(position, width, height, options).y).toBe(150);
			});
		});

		describe('when vertical alignment is bottom', function() {
			beforeEach(function() {
				options.vertical = 'bottom';
			});

			it ('should return a position with the bottom of the object at the position', function() {
				expect(alignment.toSelf2d(position, width, height, options).y).toBe(100);
			});
		});

		describe('when vertical alignment is not top or bottom', function() {
			beforeEach(function() {
				options.vertical = 'derp';
			});

			it ('should return a position with the centre of the object over the position', function() {
				expect(alignment.toSelf2d(position, width, height, options).y).toBe(112.5);
			});
		});

		describe('when a function is passed in for position data', function() {
			beforeEach(function() {
				position = {
					x: function() { return 200; },
					y: function() { return 200; }
				};
				options.horizontal = 'derp';
				options.vertical = 'derp';
			});

			it ('should call the function to get the result', function() {
				expect(alignment.toSelf2d(position, width, height, options).x).toBe(150);
				expect(alignment.toSelf2d(position, width, height, options).y).toBe(212.5);
			});
		});
	});
});