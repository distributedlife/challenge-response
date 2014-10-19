define(["lodash", "lib/ui/orthographic"], function(_, orthographic_display) {
    "use strict";

    return function(element, width, height, options) {
        var setup = function() {};

        var update = function() {};

        var client = Object.create(orthographic_display(element, width, height, options, setup, update));

        return client;
    };
});
