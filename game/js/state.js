"use strict";

module.exports = function (entities) {
    return {
        controller: new entities.controller()
    };
};