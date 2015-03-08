"use strict";

module.exports = {
    deps: ["Window"],
    type: "UpdateLoop",
    func: function (window) {
        return {
            UpdateLoop: function (updateFunc) {
                return {
                    run: function (time) {
                        updateFunc(time);

                        window().requestAnimationFrame(this.run.bind(this));
                    }
                };
            }
        };
    }
};