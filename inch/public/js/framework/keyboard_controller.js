var _ = require('lodash');
var $ = require('zepto-browserify').$;
var window = require('window');

"use strict";

module.exports = function(socket, element, flush_pending_acks) {
    var controller = {
        last_sent: {},
        input_data: {
            x: 0,
            y: 0,
            touches: [],
            keys: [],
            single_press_keys: [],
            sent_timestamp: undefined
        },

        keys: {},
        single_press_keys: {},

        key_map: function() {
            var map = {
                '9': 'tab',
                '17': 'control',
                '18': 'alt',
                '27': 'escape',
                '32': 'space',
                '37': 'left',
                '38': 'up',
                '39': 'right',
                '40': 'down'
            };

            for(var i = 48; i <= 122; i++) {
                if (i > 57 && i < 65) { continue ;}
                if (i > 90 && i < 97) { continue ;}
                if (map[i] !== undefined) {
                    continue;
                }
                map[i] = String.fromCharCode(i);
            } 

            return map;
        },
        mouse_map: function() {
            return {
                '1': 'button1',
                '3': 'button2'
            };
        },
        
        single_press: function(key) { 
            this.single_press_keys[key] = true; 
        },

        press: function(key) { 
            this.keys[key] = true; 
        },
        
        release: function(key) { 
            this.keys[key] = false; 
        },

        handleClickOrTouch: function(func, value, e) {
            func(value); 
            e.preventDefault();
            e.stopPropagation();
        },

        detectButtonsMappingToKeys: function() {
            _.each(this.key_map(), function(value, key) {
                var classname = ".button.key-"+value;
                if ('ontouchstart' in window) {
                    $(classname).on('touchstart', function(e) { this.handleClickOrTouch(this.press.bind(this), value, e); }.bind(this));
                    $(classname).on('touchend', function(e) { this.handleClickOrTouch(this.release.bind(this), value, e); }.bind(this));
                    $(classname).on('touchcancel', function(e) { this.handleClickOrTouch(this.release.bind(this), value, e); }.bind(this));
                    $(classname).on('touchleave', function(e) { this.handleClickOrTouch(this.release.bind(this), value, e); }.bind(this));
                } else {
                    $(classname).on('mousedown', function(e) { this.handleClickOrTouch(this.press.bind(this), value, e); }.bind(this));
                    $(classname).on('mouseup', function(e) { this.handleClickOrTouch(this.release.bind(this), value, e); }.bind(this));
                    $(classname).on('mouseleave', function(e) { this.handleClickOrTouch(this.release.bind(this), value, e); }.bind(this));
                }
            }.bind(this));
        },

        bindToWindowEvents: function() {
            $(window).on('mousedown', function(e) {
                this.press(this.mouse_map()[e.which]);
                e.preventDefault();
            }.bind(this));

            $(window).on('mouseup', function(e) {
                this.release(this.mouse_map()[e.which]);
                e.preventDefault();
            }.bind(this));

            //TODO: this is failing in the latest versions
            // $(window).on('mouseleave', function(e) {
            //     this.release(this.mouse_map()[e.which]);
            //     e.preventDefault();
            // }.bind(this));

            $("#"+element).on('mousemove', function(e) {
                this.input_data.x = e.layerX;
                this.input_data.y = e.layerY;
            }.bind(this));

            $("#"+element).on('touchstart', function(e) {
                _.each(e.touches, function(touch) {
                    var x = touch.clientX - touch.target.offsetLeft;
                    var y = touch.clientY - touch.target.offsetTop;
                    this.input_data.touches.push({ id: touch.identifier, x: x, y: y, force: touch.webkitForce || 1 });
                }.bind(this));
            }.bind(this));

            $("#"+element).on('touchmove', function(e) {
                _.each(e.touches, function(touch) {
                    var x = touch.clientX - touch.target.offsetLeft;
                    var y = touch.clientY - touch.target.offsetTop;
                    this.input_data.touches.push({ id: touch.identifier, x: x, y: y, force: touch.webkitForce || 1 });
                }.bind(this));
            }.bind(this));

            $("#"+element).on('touchend', function(e) {
                var ids = _.map(e.changedTouches, function(touch) { return touch.identifier; }) ;
                this.input_data.touches = _.reject(this.input_data.touches, function(touch) { return ids.indexOf(touch.id) !== -1});
            }.bind(this));

            $("#"+element).on('touchleave', function(e) {
                var ids = _.map(e.changedTouches, function(touch) { return touch.identifier; }) ;
                this.input_data.touches = _.reject(this.input_data.touches, function(touch) { return ids.indexOf(touch.id) !== -1});
            }.bind(this));

            $("#"+element).on('touchcancel', function(e) {
                var ids = _.map(e.changedTouches, function(touch) { return touch.identifier; }) ;
                this.input_data.touches = _.reject(this.input_data.touches, function(touch) { return ids.indexOf(touch.id) !== -1});
            }.bind(this));


            $(window.document).keypress(function(e) {
                if (e.metaKey) { return; }

                this.single_press(this.key_map()[e.which]);
                //TODO: we need a prevent default in order to stop space moving the page, but we need it 
                //to ensure that both keypress and keydown fire on the same event. We can work around this 
                //but we'll need to get a replicable scene (this is only a problem for the space key)
                // e.preventDefault();
            }.bind(this));

            $(window.document).keydown(function(e) {
                if (e.metaKey) { return; }

                this.press(this.key_map()[e.which]);
                // e.preventDefault();
            }.bind(this));

            $(window.document).keyup(function(e) {
                this.release(this.key_map()[e.which]);
            }.bind(this));

            $(window).on('blur', function() { socket.emit('pause'); }.bind(this));
            $(window).on('focus', function() { socket.emit('unpause'); }.bind(this));
            $(window).on('mousedown', function() { socket.emit('unpause'); }.bind(this));
            $(window).on('mouseup', function() { socket.emit('unpause'); }.bind(this));
        },

        emit: function() {
            //TODO: make a stats function to wrap anyold function
            // stats( 'check-input' ).start();

            var keys_to_send = [];
            _.each(this.keys, function(value, key) {
                if (value) { 
                    keys_to_send.push(key); 
                }
            });
            this.input_data.keys = keys_to_send;

            var single_press_keys_to_send = [];
            _.each(this.single_press_keys, function(value, key) {
                if (value) { 
                    single_press_keys_to_send.push(key); 
                }
                this.single_press_keys[key] = false
            }.bind(this));
            this.input_data.single_press_keys = single_press_keys_to_send;
            
            if (_.isEqual(this.input_data, this.last_sent)) {
                return;
            }

            this.input_data.sent_timestamp = Date.now();
            this.input_data.pending_acks = flush_pending_acks();

            socket.emit('input', this.input_data);
            this.last_sent = _.clone(this.input_data, true);

            // stats( 'check-input' ).start();
        },
        notifyServerOfInput: function() { setInterval(this.emit.bind(this), 1000 / 120); }
    };

    controller.detectButtonsMappingToKeys();
    controller.bindToWindowEvents();
    controller.notifyServerOfInput();

    return controller;
};