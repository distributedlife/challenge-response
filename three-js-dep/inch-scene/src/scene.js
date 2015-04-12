'use strict';

var _ = require('lodash');

module.exports = function (scene) {
    var thingsInScene = [];

    return {
        add: function () {
            _.each(arguments, function (mesh) {
                scene.add(mesh);
                thingsInScene.push(mesh);
            });
        },
        remove: function () {
            _.each(arguments, function (mesh) {
                scene.remove(mesh);

                var i = thingsInScene.indexOf(mesh);
                thingsInScene.splice(i, 1);
            });
        },
        reset: function () {
            _.each(thingsInScene, function (mesh) {
                scene.remove(mesh);
            });

            thingsInScene = [];
        },
        scene: function () {
            return scene;
        }
    };
};