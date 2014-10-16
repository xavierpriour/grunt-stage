'use strict';

var grunt = require('grunt');

/*
  ======== A Handy Little Nodeunit Reference ========
  https://github.com/caolan/nodeunit

  Test methods:
    test.expect(numAssertions)
    test.done()
  Test assertions:
    test.ok(value, [message])
    test.equal(actual, expected, [message])
    test.notEqual(actual, expected, [message])
    test.deepEqual(actual, expected, [message])
    test.notDeepEqual(actual, expected, [message])
    test.strictEqual(actual, expected, [message])
    test.notStrictEqual(actual, expected, [message])
    test.throws(block, [error], [message])
    test.doesNotThrow(block, [error], [message])
    test.ifError(value)
*/

exports.stage = {
  setUp: function(done) {
    // setup here if necessary
    done();
  },

  // stage:<stage> simple loading
  testLoad5: function(test) {
    test.expect(1);
    var expected = grunt.file.readJSON('test/fixtures/local.json');
    expected.stage = 'local5';
    var actual = grunt.config('stg');
    // we're not concerned with test debug info.
    delete actual.test;
    test.deepEqual(actual, expected, 'stage:<stage> should put file content in grunt.config(\'stg\').');
    test.done();
  },
};
