var expect = require('expect');
var sinon = require('sinon');

describe("the camera", function () {
	var adapter = {
		newOrthographicCamera: sinon.spy(),
		setPosition: sinon.spy(),
		setCameraAspectRatio: sinon.spy(),
		updateProjectionMatrix: sinon.spy()
	};
	var dimensions = {
		get: function() {
			return {
				usableWidth: 200,
				usableHeight: 200
			};
		}
	};
	var defer = function(dep) {
		return function() {
			return dep;
		}
	};

	beforeEach(function () {
		adapter.newOrthographicCamera.reset();
		var camera = require("../src/camera").func(defer(adapter), defer(dimensions)).Camera();
	});

	it("it should be centered on the usable width and height of the canvas", function() {
		expect(adapter.newOrthographicCamera.firstCall.args).toEqual([-100, 100, 100, -100, -2000, 1000]);
	})

	it("it should position z at 1", function (){
		expect(adapter.setPosition.firstCall.args).toEqual([undefined, {z:1}]);
	});

	it("it should set the aspect ratio correctly", function () {
		expect(adapter.setCameraAspectRatio.firstCall.args).toEqual([undefined, 1]);
	});
});