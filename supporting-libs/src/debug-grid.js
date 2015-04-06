'use strict';

//jshint maxcomplexity: 7
//It's the default value || code that pushes it over the limit. I'm ok with this.
module.exports = function(adapter, dims, spacing, colour) {
  var lineSpacing = spacing || 50;
  var lineColour = colour || 0x00FF00;
  var verticalLines = dims.usableWidth / lineSpacing;
  var horizontalLines = dims.usableHeight / lineSpacing;
  var x, y, w, h;

  var vertices = [];
  for (w = verticalLines / -2; w < 0; w += 1) {
    x = w * lineSpacing;

    vertices.push({x: x, y: -dims.usableHeight, z: 0});
    vertices.push({x: x, y:  dims.usableHeight, z: 0});
  }
  for (h = horizontalLines / -2; h < 0; h += 1) {
    y = h * lineSpacing;

    vertices.push({x: -dims.usableWidth, y: y, z: 0});
    vertices.push({x:  dims.usableWidth, y: y, z: 0});
  }
  for (w = verticalLines / 2; w >= 0; w -= 1) {
    x = w * lineSpacing;

    vertices.push({x: x, y: -dims.usableHeight, z: 0});
    vertices.push({x: x, y:  dims.usableHeight, z: 0});
  }
  for (h = horizontalLines / 2; h >= 0; h -= 1) {
    y = h * lineSpacing;

    vertices.push({x: -dims.usableWidth, y: y, z: 0});
    vertices.push({x:  dims.usableWidth, y: y, z: 0});
  }

  return adapter.createColouredLinePieces(vertices, lineColour);
};