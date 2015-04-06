'use strict';

var THREE = require('inch-threejs');
var each = require('lodash').each;
var $ = require('zepto-browserify').$;

module.exports = {
  getUnderlyingObject: function () {
    return THREE;
  },
  newPerspectiveCamera: function (fov, aspect, near, far) {
    return new THREE.PerspectiveCamera(fov, aspect, near, far);
  },
  //jshint maxparams: 6
  //A frustum requires this many parameters to define it's bounds
  newOrthographicCamera: function (left, right, top, bottom, near, far) {
    return new THREE.OrthographicCamera(left, right, top, bottom, near, far);
  },
  newCircle: function (radius, segments) {
    return new THREE.CircleGeometry(radius, segments);
  },
  newGeometryFromShape: function (shape) {
    return new THREE.ShapeGeometry(shape);
  },
  newShapeFromText: function (text, options) {
    return THREE.FontUtils.generateShapes(text, options);
  },
  newMesh: function (geometry, material) {
    return new THREE.Mesh(geometry, material);
  },
  newBasicMaterial: function () {
    return new THREE.MeshBasicMaterial();
  },
  setPosition: function (obj, newPosition) {
    obj.position.set(
      newPosition.x || obj.position.x,
      newPosition.y || obj.position.y,
      newPosition.z || obj.position.z
    );
  },
  setScale: function (obj, newScale) {
    obj.scale.set(newScale, newScale, newScale);
  },
  setCameraAspectRatio: function (camera, aspectRatio) {
    camera.aspect = aspectRatio;

    this.updateProjectionMatrix(camera);
  },
  setVisible: function (obj, visible) {
      obj.visible = visible;
  },
  setTransparent: function (material, transparent) {
    material.transparent = transparent;
  },
  setAlphaTest: function (material, alphaTest) {
    material.alphaTest = alphaTest;
  },
  setBlending: function (material, blending) {
    material.blending = blending;
  },
  setOpacity: function (material, opacity) {
    material.opacity = opacity;
  },
  setColour: function (material, colour) {
    material.color.setRGB(colour[0], colour[1], colour[2]);
  },
  updateProjectionMatrix: function (obj) {
    obj.updateProjectionMatrix();
  },
  createScene: function () {
    return new THREE.Scene();
  },
  createRenderer: function (dims) {
    var renderer = new THREE.WebGLRenderer({ antialias: true });

    renderer.setSize(dims.usableWidth, dims.usableHeight);

    return renderer;
  },
  attachRenderer: function (element, renderer) {
    $('#' + element).append(renderer.domElement);
  },
  loadFont: function (fontData) {
    //jshint camelcase:false
    //can't help inconsistent case usage in deps
    if (THREE.typeface_js && THREE.typeface_js.loadFace) {
      THREE.typeface_js.loadFace(fontData);
    }

    return fontData;
  },
  createColouredLinePieces: function (vertices, colour) {
    var geometry = new THREE.Geometry();

    each(vertices, function (vertex) {
      geometry.vertices.push(new THREE.Vector3(vertex.x, vertex.y, vertex.z));
      geometry.colors.push(new THREE.Color());
    });

    var material = new THREE.LineBasicMaterial({ color: colour });

    var line = new THREE.Line(geometry, material, THREE.LinePieces);
    line.visible = true;

    return line;
  },
  getAdditiveBlendingConstant: function () {
    return THREE.AdditiveBlending;
  },
  computeBoundingBox: function (geometry) {
    geometry.computeBoundingBox();
  }
};