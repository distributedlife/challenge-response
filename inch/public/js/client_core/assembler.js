"use strict";

var dimensions = require("../client_core/dimensions");
var layout_icons = require("../client_core/layout_icons");
var _ = require('lodash');
var $ = require('zepto-browserify').$;

module.exports = function(config) {
    config.ratio = config.ratio || 26/10;

    var dims = dimensions(config.ratio);

    layout_icons(dims.orientation);

    _.defaults(config, {
        display_config: {
            controls: []
        },
        width: dims.usable_width,
        height: dims.usable_height,
        element: "canvas"
    });

    var engine_assembler = config.renderer(config);

    $(require('window')).on('load resize', engine_assembler.resize.bind(engine_assembler));
    engine_assembler.resize();

    return engine_assembler;
};