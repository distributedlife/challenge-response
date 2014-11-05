"use strict";

module.exports = {
  lib_image_path: "/inch/images/lib/",
  game_image_path: "/game/images/",
  audio_path: "/game/audio/",
  swf_path: "/inch/swf/",

  global_volume: 0.0,
  wireframe: false,
  nodamage: false,
  nostats: true,

  grid: {
    enabled: true,
    size: 75,
    colour: 0x00FF00
  },

  axes: {
    enabled: false
  },

  resolve_lib_image: function(filename) {
    return this.lib_image_path + filename;
  },
  resolve_game_image: function(filename) {
    return this.game_image_path + filename;
  },
  resolve_audio: function(filename) {
    return this.audio_path + filename;
  },
  resolve_swf: function(filename) {
    return this.swf_path + filename;
  }
};