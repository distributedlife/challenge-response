define([], function() {
	"use strict";

	return {
		prior_state: null,
        current_state: null,

        the: function(name) { return function(state) { return state[name]; }; },
        all: function(name) { return function(state) { return state[name]; }; },
        is: function(name) { return function(state) { return state[name] === true; }; },
        isnt: function(name) { return function(state) { return state[name] === false; }; },
        is2: function(f) { return f(this.current_state) === true; },

        update_state: function(new_state) {
        	this.prior_state = this.current_state;
            this.current_state = new_state;
        },

        changed: function(f) { 
        	if (this.prior_state === null) { return true; }

        	return f(this.prior_state) !== f(this.current_state); 
        },
        changed_strict: function(f) { 
        	if (this.prior_state === null) { return false; }

        	return f(this.prior_state) !== f(this.current_state); 
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

        on_change: function(model, callback) {
            this.changes.push({
                type: 'object',
                focus: model, 
                callback: callback
            });
        },
        on_conditional_change: function(model, condition, callback) {
            this.changes.push({
                type: 'object',
                focus: model, 
                'when': condition, 
                callback: callback
            });
        },
        on_element_change: function(model_array, callback) {
            this.changes.push({
                type: 'array',
                focus: model_array,
                callback: callback,
                detection_func: this.element_changed.bind(this),
                operates_on: this.value.bind(this)
            });
        },
        on_element_arrival: function(model_array, callback) {
            this.changes.push({
                type: 'array',
                focus: model_array,  
                callback: callback,
                detection_func: this.element_added.bind(this),
                operates_on: this.value.bind(this)
            });
        },
        on_element_removal: function(model_array, callback) {
            this.changes.push({
                type: 'array',
                focus: model_array, 
                callback: callback,
                detection_func: this.element_removed.bind(this),
                operates_on: this.prior_value.bind(this)
            });
        },
        handle_objects: function(change) {
            if (this.changed(change.focus)) {
                if (change.when === undefined) {
                    change.callback(this.value(change.focus), this.prior_value(change.focus));
                } else {
                    if (change.when(this.value(change.focus))) {
                        change.callback(this.value(change.focus), this.prior_value(change.focus));
                    }
                }
            }
        },
        handle_arrays: function(change) {
            _.each(change.operates_on(change.focus), function(model) {
                if (change.detection_func(change.focus, model)) {
                    change.callback(model, this.prior_element(change.focus, model));
                }
            }.bind(this));
        },
        detect_changes_and_notify_observers: function() {
            _.each(this.changes, function(change) {
                if (change.type === 'array') {
                    this.handle_arrays(change);
                } else {
                    this.handle_objects(change);   
                }
            }.bind(this));
        },
	};
});