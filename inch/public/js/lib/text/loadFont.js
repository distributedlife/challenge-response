var THREE = require('three');

"use strict";

module.exports = function(fontData) {
	if (_typeface_js && _typeface_js.loadFace) {
		_typeface_js.loadFace(fontData);
	};

	return fontData;
}