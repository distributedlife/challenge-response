var THREE = require('inch-threejs');

"use strict";

module.exports = function(width, height, size, colour) {
  var geometry = new THREE.Geometry();
  size = size || 50;
  colour = colour || 0x00FF00;
  var vertical_lines = width / size;
  var horizontal_lines = height / size;

  for(var w = 0; w < vertical_lines / 2; w++) {
    var x = w * size;

    geometry.vertices.push(new THREE.Vector3(x, 0, 0), new THREE.Vector3(x, height, 0));
    geometry.colors.push(new THREE.Color(), new THREE.Color());
  }
  for (var h = 0; h < horizontal_lines / 2; h++) {
    var y = h * size;

    geometry.vertices.push(new THREE.Vector3(0, y, 0), new THREE.Vector3(width, y, 0));
    geometry.colors.push(new THREE.Color(), new THREE.Color());
  }

  for(var w = vertical_lines; w >= vertical_lines / 2; w--) {
    var x = w * size;

    geometry.vertices.push(new THREE.Vector3(x, 0, 0), new THREE.Vector3(x, height, 0));
    geometry.colors.push(new THREE.Color(), new THREE.Color());
  }
  for (var h = horizontal_lines; h >= horizontal_lines / 2; h--) {
    var y = h * size;

    geometry.vertices.push(new THREE.Vector3(0, y, 0), new THREE.Vector3(width, y, 0));
    geometry.colors.push(new THREE.Color(), new THREE.Color());
  }

  var material = new THREE.LineBasicMaterial({ color: colour});

  var line = new THREE.Line(geometry, material, THREE.LinePieces);
  line.visible = true;

  return line;
};