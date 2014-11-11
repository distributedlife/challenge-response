"use strict";

var window = require("window");

module.exports = function(updateFunc) {
    return {
        run: function(time) {
            updateFunc(time);

            window.requestAnimationFrame(this.run.bind(this));
        }
    };
};