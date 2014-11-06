"use strict";

module.exports = {
    acks: [],
    reset: function() {
        this.acks = [];
    },
    flush: function() {
        var pending = this.acks;

        this.reset();

        return pending;
    },
    add: function(packetId) {
        this.acks.push({ id: packetId, rcvd_timestamp: Date.now(), names: [] });
    },
    ackLast: function(name) {
        this.acks[this.acks.length - 1].names.push(name);
    }
}; 