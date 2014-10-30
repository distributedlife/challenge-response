define(["lodash"], function(_) {
	"use strict";

    var invoke_callback = function(callback, model, prior_model, data) {
        if (_.isArray(data)) {
            var args = _.clone(data);
            args.unshift(model, prior_model);
            callback.apply(this, args);
        } else {
            callback(model, prior_model, data);
        }
    };

    var prior_state = null;
    var current_state = null;
    var changes = [];

    var changed = function(f) { 
        if (prior_state === null) { return true; }

        return !_.isEqual(f(prior_state), f(current_state));
    };
    var property_changed = function(f, p) {
        if (prior_state === null) { return true; }
        
        return p(f(prior_state)) !== p(f(current_state));
    };

    var value = function(f) {  
        if (current_state === null) { 
            return false; 
        }

        return f(current_state);  
    };
    var prior_value = function(f) {  
        if (prior_state === null) { 
            return false; 
        }

        return f(prior_state);  
    };

    var element = function(f, model) { 
        return _.where(f(prior_state), {id: model.id});
    };
    var prior_element = function(f, model) {  
        if (prior_state === null) { 
            return null; 
        }

        return _.where(f(prior_state), {id: model.id})[0];
    };
    var element_added = function(f, model) { 
        return (_.where(f(prior_state), {id: model.id}).length === 0);
    };
    var element_removed = function(f, model) { 
        return (_.where(f(current_state), {id: model.id}).length === 0);
    };
    var element_changed = function(f, model) { 
        if (prior_state === null) { return true; }

        return _.where(f(current_state), {id: model.id}) !== _.where(f(prior_state), {id: model.id});
    };

    var handle_objects = function(change) {
        if (changed(change.focus)) {
            if (change.when === undefined) {
                invoke_callback(change.callback, value(change.focus), prior_value(change.focus), change.data);
            } else {
                if (change.when(value(change.focus))) {
                    invoke_callback(change.callback, value(change.focus), prior_value(change.focus), change.data);
                }
            }
        }
    };
    var handle_object_property = function(change) {
        if (changed(change.focus)) {
            if (change.when === undefined) {
                invoke_callback(change.callback, value(change.focus), prior_value(change.focus), change.data);
            } else {
                if (change.when(change.focus(current_state))) {
                    invoke_callback(change.callback, value(change.focus), prior_value(change.focus), change.data);
                }
            }
        }
    };
    var handle_arrays = function(change) {
        _.each(change.operates_on(change.focus), function(model) {
            if (change.detection_func(change.focus, model)) {
                invoke_callback(change.callback, model, prior_element(change.focus, model), change.data);
            }
        });
    };

    var equals = function(expected_value) { return function(current_value) { return current_value === expected_value; }; };

    return {
        the: function(name) { return function(state) { return state[name]; }; },
        obj: function(name) { return function(state) { return state[name]; }; },
        property: function(name) { return function(state) { return state[name]; }; },
        all: function(name) { return function(state) { return state[name]; }; },
        is: function(name) { return function(state) { return state[name] === true; }; },
        isnt: function(name) { return function(state) { return state[name] === false; }; },
        is2: function(f) { return f(current_state) === true; },   

        screen_width: function(state) { return state.dimensions.width; },
        screen_height: function(state) { return state.dimensions.height; },

        update_state: function(new_state) {
        	prior_state = current_state;
            current_state = new_state;
        },

        has_no_current_state: function() {
            return current_state !== null;
        },

        changed: changed,
        property_changed: property_changed,
        changed_strict: function(f) { 
        	if (prior_state === null) { return false; }

            return !_.isEqual(f(prior_state), f(current_state));
      	},

        value: value,
        prior_value: prior_value,

        element: element,
        prior_element: prior_element,

        on_change: function(model, callback, data) {
            var change = {
                type: 'object',
                focus: model, 
                callback: callback,
                data: data
            };

            handle_objects(change);
            changes.push(change);
        },
        on_property_change: function(property, callback, data) {
            var change = {
                type: 'property',
                focus: property, 
                callback: callback,
                data: data
            };

            handle_object_property(change);
            changes.push(change);
        },
        on_property_changed_to: function(property, condition, callback, data) {
            var change = {
                type: 'property',
                focus: property,
                'when': equals(condition),
                callback: callback,
                data: data
            };

            handle_object_property(change);
            changes.push(change);
        },
        on_conditional_change: function(model, condition, callback, data) {
            var change = {
                type: 'object',
                focus: model, 
                'when': condition, 
                callback: callback,
                data: data
            };

            handle_objects(change);
            changes.push(change);
        },
        on_element_change: function(model_array, callback, data) {
            var change = {
                type: 'array',
                focus: model_array,
                callback: callback,
                detection_func: element_changed,
                operates_on: value,
                data: data
            };

            handle_arrays(change);
            changes.push(change);
        },
        on_element_arrival: function(model_array, callback, data) {
            var change = {
                type: 'array',
                focus: model_array,  
                callback: callback,
                detection_func: element_added,
                operates_on: value,
                data: data
            };

            handle_arrays(change);
            changes.push(change);
        },
        on_element_removal: function(model_array, callback, data) {
            var change = {
                type: 'array',
                focus: model_array, 
                callback: callback,
                detection_func: element_removed,
                operates_on: prior_value,
                data: data
            };

            handle_arrays(change);
            changes.push(change);
        },
        detect_changes_and_notify_observers: function() {
            _.each(changes, function(change) {
                if (change.type === 'array') {
                    handle_arrays(change);
                } else if (change.type === 'object') {
                    handle_objects(change);   
                } else {
                    handle_object_property(change);
                }
            });
        },
	};
});