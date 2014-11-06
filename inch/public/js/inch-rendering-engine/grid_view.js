var THREE = require('inch-threejs');

"use strict";

module.exports = function(width, height, config) {
  var build_grid = function() {
    var geometry = new THREE.Geometry();
    var vertical_lines = width / config.size;
    var horizontal_lines = height / config.size;

    for(var w = 0; w < vertical_lines / 2; w++) {
      var x = w * config.size;

      geometry.vertices.push(new THREE.Vector3(x, 0, 0), new THREE.Vector3(x, height, 0));
      geometry.colors.push(new THREE.Color(), new THREE.Color());
    }
    for (var h = 0; h < horizontal_lines / 2; h++) {
      var y = h * config.size;

      geometry.vertices.push(new THREE.Vector3(0, y, 0), new THREE.Vector3(width, y, 0));
      geometry.colors.push(new THREE.Color(), new THREE.Color());
    }

    for(var w = vertical_lines; w >= vertical_lines / 2; w--) {
      var x = w * config.size;

      geometry.vertices.push(new THREE.Vector3(x, 0, 0), new THREE.Vector3(x, height, 0));
      geometry.colors.push(new THREE.Color(), new THREE.Color());
    }
    for (var h = horizontal_lines; h >= horizontal_lines / 2; h--) {
      var y = h * config.size;

      geometry.vertices.push(new THREE.Vector3(0, y, 0), new THREE.Vector3(width, y, 0));
      geometry.colors.push(new THREE.Color(), new THREE.Color());
    }

    var material = new THREE.LineBasicMaterial({ color: config.colour});

    var line = new THREE.Line(geometry, material);
    line.visible = true;
    line.type = THREE.LinePieces;

    return line;
  };

  return {
    grid: build_grid()
  };
};
