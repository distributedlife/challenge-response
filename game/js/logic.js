"use strict";

module.exports = function (game_state) {
    return {
        update: function (dt) {
            game_state.controller.update(dt);
        }
    };
};