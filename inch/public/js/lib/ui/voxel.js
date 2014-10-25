define(["vendor/three", "lib/util/temporary_effect", "lib/math/lerp"], function(THREE, temporary_effect, lerp) {
  "use strict";
  
  //TODO: remove temporary effect and make two kinds of voxel, temp and non-temp or mix it in some how... Or make everything inherit from temporary effect and just use a duration of zero to indicate infinite life.
  return function(model, options) {
    //MOVE the defaults and setup into some kind of default thingy, possibly passing a continuation for the geometry
    _.defaults(options, {
      transparent: false,
      alphaTest: 0.1,
      blending: THREE.AdditiveBlending,
      opacity: 1.0,
      colour: {
        from: [1.0, 1.0, 1.0],
        to: [1.0, 1.0, 1.0]
      },
      scale: {
        from: 1.0,
        to: 1.0
      },
      position: {
        from: {x: model.x, y: model.y, z: model.z || 0},
        to: {x: model.x, y: model.y, z: model.z || 0}
      },
      //TODO: use config thingy and wrap in shared code
      wireframe: false
    });

    //TODO: init of geo should be a func passed in
    var geometry = new THREE.BoxGeometry(model.size, model.size, model.size);
    var material = new THREE.MeshBasicMaterial({ 
      transparent: options.transparent,
      alphaTest: options.alphaTest,
      blending: options.blending,
      opacity: options.opacity,
      wireframe: options.wireframe
    });
    
    var mesh = new THREE.Mesh(geometry, material);
    //TODO: Collapse?
    mesh.position = options.position.from;
    mesh.scale.set(options.scale.from, options.scale.from, options.scale.from);

    var voxel = {
      mesh: mesh,
      transitions: [],

      update_from_model: function(updated_model) {
        this.mesh.position.x = updated_model.x;
        this.mesh.position.y = updated_model.y;
        this.mesh.position.z = updated_model.z || 0;
        this.mesh.visible = updated_model.active;
      },

      set_colour: function(from) {
        if (from.length === 3) {
          from.push(1.0);
        }

        options.colour.from = from;
        options.colour.to = from;

        this.mesh.material.color.setRGB(from[0], from[1], from[2]);  
        this.mesh.material.opacity = from[3];
        this.mesh.material.needsUpdate = true;
      },

      // transition: function(transition_options) {
      //   _.defaults(transition_options, options);
      //   options = transition_options;
      // },

      transition_colour: function(from, to, duration) {
        options.colour.from = from;
        options.colour.to = to;

        this.transitions.push(Object.create(temporary_effect(duration, this.tick_colour.bind(this))));
      },

      transition_position: function(from, to, duration) {
        options.position.from = from;
        options.position.to = to;

        this.transitions.push(Object.create(temporary_effect(duration, this.tick_position.bind(this))));
      },

      transition_to: function(to, duration) {
        options.position.from = {x: this.mesh.position.x, y: this.mesh.position.y, z: this.mesh.position.z };
        options.position.to = to;

        this.transitions.push(Object.create(temporary_effect(duration, this.tick_position.bind(this))));
      },

      transition: function(duration) {
        options.duration = duration;
      },

      tick_colour: function(dt, progress) {
        var rgba = lerp.lerpRGBA(options.colour.from, options.colour.to, progress);
        this.mesh.material.color.setRGB(rgba[0], rgba[1], rgba[2]);  
        this.mesh.material.opacity = rgba[3];
        this.mesh.material.needsUpdate = true;
      },

      tick_position: function(dt, progress) {
        var position = lerp.lerpVector(options.position.from, options.position.to, progress);
        this.mesh.position = position;
      },

      tick: function(dt) {
        _.each(this.transitions, function(t) { t.tick(dt); });

        this.transitions = _.reject(this.transitions, function(t) { return !t.is_alive(); });

        // var scale = lerp.lerp(options.scale.from, options.scale.to, this.progress());
        // this.mesh.scale.set(scale, scale, scale);
      },

      //TODO: common display thingy
      hide: function() {
        this.mesh.visible = false;
      }
    }
    // _.extend(voxel, temporary_effect(options.duration, voxel.on_tick.bind(voxel)));

    return voxel;
  };
});
