'use strict';

var grunt = require('grunt');

exports.stage = {
  setUp: function(done) {
    // setup here if necessary
    done();
  },

  // stage:<stage> simple loading
  testCmdIsRequire: function(test) {
    test.expect(1);
    var expected = {
      cmd: {
        command: 'require',
        args: [],
      }
    };
    var actual = grunt.config('stg.test');
    test.deepEqual(actual, expected, 'stage:require should execute proper command.');
    test.done();
  },
};
