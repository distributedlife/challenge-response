"use strict";

module.exports = function(window, updateFunc) {
    return {
        run: function(time) {
            updateFunc(time);

            window.requestAnimationFrame(this.run.bind(this));
        }
    };
};