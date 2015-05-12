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
  testTaskNone: function(test) {
    test.expect(2);
    var expected = {
      cmd: {
        command: '',
        args: [],
      }
    };
    var actual = grunt.config('stg.test');
    test.deepEqual(actual, expected, 'stage:<task> should do nothing when <task>:<stage> does not exist.');
    test.equal(grunt.config('stg.stage'), 'localNone', "stage 'localNone' should be loaded");
    test.done();
  },
};
