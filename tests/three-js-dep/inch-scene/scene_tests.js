'use strict';

var sinon = require('sinon');
var assert = require('assert');

var threeJsScene = {
	add: sinon.spy(),
	remove: sinon.spy()
};

var inchScene = require('../../../game/js/three-js-dep/inch-scene/scene');
var scene = inchScene(threeJsScene);

describe('adding an mesh to the scene', function() {
	beforeEach(function() {
		threeJsScene.add.reset();
	});

	it('should accept a mesh', function() {
		var mesh = 'mesh';

		scene.add(mesh);

		assert(threeJsScene.add.calledWith(mesh));
	});

	it('should accept an list of meshes', function() {
		var mesh1 = 'mesh', mesh2 = 'mesh';

		scene.add(mesh1, mesh2);

		assert(threeJsScene.add.calledWith(mesh1));
		assert(threeJsScene.add.calledWith(mesh2));
	});
});

describe('remove a mesh from the scene', function() {
	beforeEach(function() {
		threeJsScene.remove.reset();
	});

	it('should support removing a single mesh', function() {
		var mesh = 'mesh';

		scene.remove(mesh);

		assert(threeJsScene.remove.calledWith(mesh));
	});

	it('should support remove an array of meshes', function() {
		var mesh1 = 'mesh', mesh2 = 'mesh';

		scene.remove(mesh1, mesh2);

		assert(threeJsScene.remove.calledWith(mesh1));
		assert(threeJsScene.remove.calledWith(mesh2));
	});
});

describe('resetting the scene', function() {
	it('should remove all meshes currently in the scene from the scene', function() {
		var mesh1 = 'mesh', mesh2 = 'mesh';

		scene.add(mesh1, mesh2);
		scene.reset();

		assert(threeJsScene.remove.calledWith(mesh1));
		assert(threeJsScene.remove.calledWith(mesh2));
	});
});