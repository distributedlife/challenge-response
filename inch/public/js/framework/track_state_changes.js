define(["lodash"], function(_) {
	"use strict";

    var invoke_callback = function(callback, model, prior_model, data) {
        if (_.isArray(data)) {
            var args = data;
            args.unshift(model, prior_model);
            callback.apply(this, args);
        } else {
            callback(model, prior_model, data);
        }
    };

	return {
		prior_state: null,
        current_state: null,

        the: function(name) { return function(state) { return state[name]; }; },
        property: function(name) { return function(state) { return state[name]; }; },
        all: function(name) { return function(state) { return state[name]; }; },
        is: function(name) { return function(state) { return state[name] === true; }; },
        isnt: function(name) { return function(state) { return state[name] === false; }; },
        is2: function(f) { return f(this.current_state) === true; },
        
        equals: function(expected_value) { return function(current_value) { return current_value === expected_value; }; },

        screen_width: function(state) { return state.dimensions.width; },
        screen_height: function(state) { return state.dimensions.height; },

        update_state: function(new_state) {
        	this.prior_state = this.current_state;
            this.current_state = new_state;
        },

        changed: function(f) { 
        	if (this.prior_state === null) { return true; }

            return !_.isEqual(f(this.prior_state), f(this.current_state));
        	// return f(this.prior_state) !== f(this.current_state); 
        },
        property_changed: function(f, p) {
            if (this.prior_state === null) { return true; }
            
            return p(f(this.prior_state)) !== p(f(this.current_state));
        },
        changed_strict: function(f) { 
        	if (this.prior_state === null) { return false; }

            return !_.isEqual(f(this.prior_state), f(this.current_state));
        	// return f(this.prior_state) !== f(this.current_state); 
      	},

        element_added: function(f, model) { 
            return (_.where(f(this.prior_state), {id: model.id}).length === 0);
        },
        element_removed: function(f, model) { 
            return (_.where(f(this.current_state), {id: model.id}).length === 0);
        },
        element_changed: function(f, model) { 
            if (this.prior_state === null) { return true; }

            return _.where(f(this.current_state), {id: model.id}) !== _.where(f(this.prior_state), {id: model.id});
        },

        value: function(f) {  
            if (this.current_state === null) { 
                return false; 
            }

            return f(this.current_state);  
        },
        prior_value: function(f) {  
            if (this.prior_state === null) { 
                return false; 
            }

            return f(this.prior_state);  
        },

        element: function(f, model) { 
            return _.where(f(this.prior_state), {id: model.id});
        },
        prior_element: function(f, model) {  
            if (this.prior_state === null) { 
                return null; 
            }

            return _.where(f(this.prior_state), {id: model.id})[0];
        },

        on_change: function(model, callback, data) {
            this.changes.push({
                type: 'object',
                focus: model, 
                callback: callback,
                data: data
            });
        },
        on_property_change: function(model, property, callback, data) {
            this.changes.push({
                type: 'property',
                focus: model, 
                property: property,
                callback: callback,
                data: data
            });
        },
        on_property_changed_to: function(model, property, condition, callback, data) {
            this.changes.push({
                type: 'property',
                focus: model, 
                property: property,
                'when': condition,
                callback: callback,
                data: data
            });
        },
        on_conditional_change: function(model, condition, callback, data) {
            this.changes.push({
                type: 'object',
                focus: model, 
                'when': condition, 
                callback: callback,
                data: data
            });
        },
        on_element_change: function(model_array, callback, data) {
            this.changes.push({
                type: 'array',
                focus: model_array,
                callback: callback,
                detection_func: this.element_changed.bind(this),
                operates_on: this.value.bind(this),
                data: data
            });
        },
        on_element_arrival: function(model_array, callback, data) {
            this.changes.push({
                type: 'array',
                focus: model_array,  
                callback: callback,
                detection_func: this.element_added.bind(this),
                operates_on: this.value.bind(this),
                data: data
            });
        },
        on_element_removal: function(model_array, callback, data) {
            this.changes.push({
                type: 'array',
                focus: model_array, 
                callback: callback,
                detection_func: this.element_removed.bind(this),
                operates_on: this.prior_value.bind(this),
                data: data
            });
        },
        handle_objects: function(change) {
            if (this.changed(change.focus)) {
                if (change.when === undefined) {
                    invoke_callback(change.callback, this.value(change.focus), this.prior_value(change.focus), change.data);
                } else {
                    if (change.when(this.value(change.focus))) {
                        invoke_callback(change.callback, this.value(change.focus), this.prior_value(change.focus), change.data);
                    }
                }
            }
        },
        handle_object_property: function(change) {
            if (this.property_changed(change.focus, change.property)) {
                if (change.when === undefined) {
                    invoke_callback(change.callback, this.value(change.focus), this.prior_value(change.focus), change.data);
                } else {
                    if (change.when(change.property(change.focus(this.current_state)))) {
                        invoke_callback(change.callback, this.value(change.focus), this.prior_value(change.focus), change.data);
                    }
                }
            }
        },
        handle_arrays: function(change) {
            _.each(change.operates_on(change.focus), function(model) {
                if (change.detection_func(change.focus, model)) {
                    invoke_callback(change.callback, model, this.prior_element(change.focus, model), change.data);
                }
            }.bind(this));
        },
        detect_changes_and_notify_observers: function() {
            _.each(this.changes, function(change) {
                if (change.type === 'array') {
                    this.handle_arrays(change);
                } else if (change.type === 'object') {
                    this.handle_objects(change);   
                } else {
                    this.handle_object_property(change);
                }
            }.bind(this));
        },
	};
});