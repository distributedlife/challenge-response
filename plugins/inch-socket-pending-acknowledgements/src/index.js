"use strict";

var _ = require('lodash');

module.exports = function () {
    var acks = [];

    var reset = function () {
        acks = [];
    };

    return {
        flush: function () {
            var pending = _.clone(acks);

            reset();

            return pending;
        },
        add: function (packetId) {
            acks.push({ id: packetId, rcvdTimestamp: Date.now(), names: []});
        },
        ackLast: function (name) {
            acks[acks.length - 1].names.push(name);
        }
    };
};