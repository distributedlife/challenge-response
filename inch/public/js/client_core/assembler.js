 define(["vendor/window", "client_core/engine", "client_core/dimensions", "client_core/layout_icons"], function (window, rendering_engine, dimensions, layout_icons) {
    "use strict";

    return function(config) {
        config.ratio = config.ratio || 26/10;
        var dims = dimensions(config.ratio);
        
        layout_icons(dims.orientation);

        config.canvas = config.canvas || "canvas";
        config.width = config.width || dims.width;
        config.height = config.height || dims.height;
        config.display_config = config.display_config || {};
        config.display_config.controls = config.display_config.controls || [];

        var display = new config.display(config.canvas, config.width, config.height, config.display_config);
        display.connect_to_server();

        if (!config.webgl) {
            return {
                resize: function() {},
                engine: {},
                run: function() {}
            }
        } else {
            var engine_assembler = {
                resize: function(e) {
                    var dims = dimensions(config.ratio);

                    layout_icons(dims.orientation);

                    $("#"+config.canvas).css("margin-top", dims.margin);
                    $("#"+config.canvas).css("width", dims.width);
                    $("#"+config.canvas).css("height", dims.height);
                    
                    this.engine.resize(dims.width, dims.height);
                },
                engine: rendering_engine(
                    display,
                    config.width, 
                    config.height
                ),
                run: function() { this.engine.run(); }
            };
        }

        $(window).on('load resize', engine_assembler.resize.bind(engine_assembler));
        engine_assembler.resize();

        return engine_assembler;
    };
});
