var expect = require('expect');
var rek = require('rekuire');
var pluginManager = rek('plugins/inch-plugins/src/plugin_manager.js').PluginManager;
var stateMutator = require("../src/index.js").func(function () { return pluginManager; });

var stateAccess;
pluginManager.load({
  type: "Ignore",
  deps: ["StateAccess"],
  func: function(access) {
    stateAccess = access();
  }
});

describe("as before but return new objects with only the changed state", function () {
  beforeEach(function () {
    stateMutator({
      controller: {
        start: 0,
        score: 0,
        state: "ready",
        list: [4],
        child: {
          age: 5,
          siblings: {
            name: "Geoff"
          }
        }
      }
    });
  });

  it("should allow a single value to mutate", function () {
    stateMutator({
      controller: {
        state: "started",
        score: 0,
        child: {
          age: 123
        }
      }
    });

    expect(stateAccess.get("controller")("state")).toBe('started');
    expect(stateAccess.get("controller")("score")).toBe(0);
    expect(stateAccess.get("controller")("child")("age")).toBe(123);
  });

  it("should work with adding to arrays", function () {
    stateMutator({
      controller: {
        list: [4, 3]
      }
    });

    expect(stateAccess.get("controller")("list")).toEqual([4, 3]);
  });

  it("should work with removing elements from arrays", function () {
    stateMutator({
      controller: {
        list: []
      }
    });

    expect(stateAccess.get("controller")("list")).toEqual([]);
  });
});