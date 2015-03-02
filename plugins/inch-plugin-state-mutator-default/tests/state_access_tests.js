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

describe("state access", function () {
  beforeEach(function () {
    stateMutator({
      start: 0,
      controller: {
        child: {
          age: 5,
          siblings: {
            name: "Geoff"
          }
        }
      }
    });
  });

  it("should return the value you asked for", function () {
    expect(stateAccess.get("start")).toEqual(0);
  });

  it("should return a function if the requested key is an object", function () {
    expect(stateAccess.get("controller") instanceof Function).toEqual(true);
  });

  it("should allow you to use the returned function to get nested objects", function () {
    expect(stateAccess.get("controller")("child")("age")).toEqual(5);
  });

  it("should allow you to initialise state", function () {
    stateAccess.add("namespace", {
      banana: "split"
    });

    expect(stateAccess.get("namespace")("banana")).toEqual("split");
  });

  it("should not allow state mutation through the access", function () {
    try {
      stateAccess.get("controller")("start") = 999;
    } catch (Error) {}

    expect(stateAccess.get("controller")("start")).toNotEqual(999);
  });

  it("should not allow mutable state on nested objects", function () {
    try {
      stateAccess.get("controller")('child').age = 21;
    } catch (Error) {}
    try {
      stateAccess.get("controller")('child')('siblings').name = 'Roger';
    } catch (Error) {}

    expect(stateAccess.get("controller")("age")).toNotEqual(21);
    expect(stateAccess.get("controller")("child")("siblings")("name")).toNotEqual('Roger');
  });
});