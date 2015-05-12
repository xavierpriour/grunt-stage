'use strict';

var grunt = require('grunt');

exports.stage = {
  setUp: function(done) {
    // setup here if necessary
    done();
  },

  // stage:<stage> simple loading
  testStageIsEmpty: function(test) {
    test.expect(1);
    var expected = {};
    var actual = grunt.config('stg');
    // we're not concerned with test debug info.
    delete actual.test;
    test.deepEqual(actual, expected, 'stage should be empty at this point.');
    test.done();
  },
};
