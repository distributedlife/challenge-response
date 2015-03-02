var expect = require('expect');
var sinon = require('sinon');

var define = require('../src/define');
var f = sinon.spy();

describe("the define fuction", function () {
  it("should handle the case when there are no deps", function () {
    expect(define('a', f)).toEqual({type: 'a', func: f});
  });

  it("should handle the case when there are deps", function () {
    expect(define('a', ['b', 'c'], f)).toEqual({type: 'a', deps: ['b', 'c'], func: f});
  });
});