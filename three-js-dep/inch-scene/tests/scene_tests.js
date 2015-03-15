var expect = require('expect');
var sinon = require('sinon');
var assert = require('assert');

var threeJsScene = {
	add: sinon.spy(),
	remove: sinon.spy()
};

var InchScene = require('../src/scene');
var inchScene = InchScene(threeJsScene);

describe('adding an mesh to the scene', function() {
	beforeEach(function() {
		threeJsScene.add.reset();
	});

	it('should accept a mesh', function() {
		var mesh = "mesh";

		inchScene.add(mesh);

		assert(threeJsScene.add.calledWith(mesh));
	});

	it('should accept an list of meshes', function() {
		var mesh1 = "mesh", mesh2 = "mesh";

		inchScene.add(mesh1, mesh2);

		assert(threeJsScene.add.calledWith(mesh1));
		assert(threeJsScene.add.calledWith(mesh2));
	});;
});

describe('remove a mesh from the scene', function() {
	beforeEach(function() {
		threeJsScene.remove.reset();
	});

	it('should support removing a single mesh', function() {
		var mesh = "mesh";

		inchScene.remove(mesh);

		assert(threeJsScene.remove.calledWith(mesh));
	});

	it('should support remove an array of meshes', function() {
		var mesh1 = "mesh", mesh2 = "mesh";

		inchScene.remove(mesh1, mesh2);

		assert(threeJsScene.remove.calledWith(mesh1));
		assert(threeJsScene.remove.calledWith(mesh2));
	});
});

describe('resetting the scene', function() {
	it('should remove all meshes currently in the scene from the scene', function() {
		var mesh1 = "mesh", mesh2 = "mesh";

		inchScene.add(mesh1, mesh2);
		inchScene.reset();

		assert(threeJsScene.remove.calledWith(mesh1));
		assert(threeJsScene.remove.calledWith(mesh2));
	});
});