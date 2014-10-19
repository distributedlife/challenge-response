"use strict";

var rek = require('rekuire');
var requirejs = rek('requirejs')
requirejs.config({ baseUrl: 'inch/public/js' })

var unique = requirejs('lib/util/unique');

module.exports = function() {
  return {
    id: unique.id(),
    active: true,
    name: "dummy"
  }
};