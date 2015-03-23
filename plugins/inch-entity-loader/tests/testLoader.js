var expect = require("expect");
var entityLoader = require('../src/loader.js');
var fs = require("fs");

describe('given an empty path', function(){
	beforeEach(function() {
		fs.mkdirSync('tests/empty');
	});

	afterEach(function() {
		fs.rmdirSync('tests/empty');
	});

	it('should return an empty hash', function(){
		expect(entityLoader.loadFromPath('tests/empty')).toEqual({});
	});
});

describe('given a path with entities in it', function(){
	beforeEach(function() {
		fs.mkdirSync('tests/folder-of-things');
		fs.writeFileSync('tests/folder-of-things/one.js', "module.exports = {herp: 'derp'}; ");
		fs.writeFileSync('tests/folder-of-things/two.js', "module.exports = function() { return 'derp' };");
		fs.writeFileSync('tests/folder-of-things/one.js.ignored', "The quick brown fox jumps over the lazy dog.");
	});

	afterEach(function() {
		fs.unlinkSync('tests/folder-of-things/one.js')
		fs.unlinkSync('tests/folder-of-things/two.js')
		fs.unlinkSync('tests/folder-of-things/one.js.ignored')
		fs.rmdirSync('tests/folder-of-things');
	});

	it('should load each into the hash', function() {
		var entities = entityLoader.loadFromPath('tests/folder-of-things');
		expect(entities.one).toEqual({herp: 'derp'});
		expect(entities.two()).toEqual('derp');
	});

	it("should ignore files that don't end in .js", function() {
		expect(entityLoader.loadFromPath('tests/folder-of-things/')['one.js.ignored']).toBe(undefined);
	});
});

describe('given an absolute path', function() {
  beforeEach(function() {
    fs.mkdirSync('tests/folder-of-things');
    fs.writeFileSync('tests/folder-of-things/one.js', "module.exports = {herp: 'derp'}; ");
  });

  afterEach(function() {
    fs.unlinkSync('tests/folder-of-things/one.js')
    fs.rmdirSync('tests/folder-of-things');
  });

  it('should load each into the hash', function() {
    var entities = entityLoader.loadFromPath(process.cwd() + '/tests/folder-of-things');
    expect(entities.one).toEqual({herp: 'derp'});
  });
});