'use strict';

var grunt = require('grunt');

exports.stage = {
  setUp: function(done) {
    // setup here if necessary
    done();
  },

  // stage:<stage> simple loading
  testHasFailed: function(test) {
    test.expect(1);
    var actual = grunt.config('stg.test');
    test.ok(actual.fail, 'grunt process should fail at that point.');
    test.done();
  }
};
