"use strict";

var window = require("window");

module.exports = function(update_func) {
    return {
        run: function(time) {
            update_func(time);

            window.requestAnimationFrame(this.run.bind(this));
        }
    };
};