var expect = require('expect');
var jsdom = require('jsdom').jsdom;
var _ = require('lodash');

describe('the plugin manager', function() {
	var document = jsdom("<div id=\"a-div\">With content.</div>");
	global.window = document.parentWindow;
	global.getComputedStyle = function() {};
	global.document = document;

	var myModule = {
		type: "AlsoMine",
		func: function() {
			return 4;
		}
	};
	var myDep = {
		type: "Dep",
		func: function () {
			return 3;
		}
	}
	var myModuleWithDep = {
		type: "Mine",
		deps: ["Dep"],
		func: function(Dep) {
			return Dep();
		}
	};

	var createAModuleToExecuteTest = function(deps, vaidationCode) {
		return {
			type: "Test",
			deps: deps,
			func: vaidationCode
		}
	}
	var pluginManager;

	describe("using a module", function() {
		beforeEach(function () {
			pluginManager = require('../src/plugin_manager').PluginManager;
		});

		it("should have it's dependencies injected as parameters", function() {
			pluginManager.load(myDep);
			pluginManager.load(myModuleWithDep);

			pluginManager.load(createAModuleToExecuteTest(["Mine"], function(Mine) {
				expect(Mine()).toEqual(3);
			}));
		});

		it("should still work for modules without dependencies", function () {
			pluginManager.load(myModule);

			pluginManager.load(createAModuleToExecuteTest(["AlsoMine"], function(AlsoMine) {
				expect(AlsoMine()).toEqual(4);
			}));
		});

		it("should all multiple plugins for specific plugin-types", function() {
			var inputMode = {
				type: "InputMode",
				func: function() { return undefined; }
			};
			pluginManager.load(inputMode);
			pluginManager.load(inputMode);

			pluginManager.load(createAModuleToExecuteTest(["InputMode"], function(InputMode) {
				expect(InputMode().length).toEqual(2);
			}));
		});

		it("should defer all modules", function () {
			var loadedSecondNeededInFirst = {
				type: "LaterDude",
				func: function() { return "Holla"; }
			};
			var loadedFirstRequiresSecondDefine = {
				deps: ["LaterDude"],
				type: "NowNowNow",
				func: function(LaterDude, OkNow) {
					return {
						LaterDude: function () { return LaterDude() },
						OkNow: OkNow
					};
				}
			};

			pluginManager.load(loadedFirstRequiresSecondDefine);
			pluginManager.load(loadedSecondNeededInFirst);

			pluginManager.load(createAModuleToExecuteTest(["NowNowNow"], function(NowNowNow) {
				expect(NowNowNow().LaterDude).toNotEqual("Holla");
				expect(NowNowNow().LaterDude()).toEqual("Holla");
			}));
		});

		it("should raise an exception if the old format for deferred modules is used", function () {
			var now = {
				deps: ["LaterDude*"],
				type: "NowNowNow",
				func: function(LaterDude, OkNow) {
					return {
						LaterDude: LaterDude,
						OkNow: OkNow
					};
				}
			};

			try {
				pluginManager.load(now);
			} catch (e) {
				expect(true).toBe(true);
				return;
			}

			expect(true).toBe(false);
		});

		it("should raise an exception if a dependency is used during the load phase", function () {
			var now = {
				deps: ["OkNow"],
				type: "NowNowNow",
				func: function(OkNow) {
					return OkNow();
				}
			};

			try {
				pluginManager.load(now);
			} catch (e) {
				expect(true).toBe(true);
				return;
			}

			expect(true).toBe(false);
		});

		it("should raise an exception if the dependency is not defined", function () {
			try {
				pluginManager.load(createAModuleToExecuteTest(["NotDefined"], function(PM) {
					expect(PM).toEqual(pluginManager);
				}));
			} catch (e) {
				expect(true).toBe(true);
				return;
			}

			expect(true).toBe(false);
		});

		it("should load itself into the set of loaded modules", function () {
			pluginManager.load(createAModuleToExecuteTest(["PluginManager"], function(PM) {
				expect(PM()).toEqual(pluginManager);
			}));
		});
	});

	describe("getting a module", function() {
		it('should return the module set by the developer', function() {
			expect(pluginManager.get("AlsoMine")).toEqual(4)
		});
	});

	describe("setting a property", function() {
		it("should set the property", function() {
			pluginManager.set("P", 1);

			pluginManager.load(createAModuleToExecuteTest(["P"], function(P) {
				expect(P()).toEqual(1);
			}));
		})
	});
});