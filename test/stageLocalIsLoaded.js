'use strict';

var grunt = require('grunt');

exports.stage = {
  setUp: function(done) {
    // setup here if necessary
    done();
  },

  // stage:<stage> simple loading
  testStageLocalIsLoaded: function(test) {
    test.expect(1);
    var expected = grunt.file.readJSON('test/fixtures/local.json');
    expected.stage = 'local';
    var actual = grunt.config('stg');
    // we're not concerned with test debug info.
    delete actual.test;
    test.deepEqual(actual, expected, 'local stage should be loaded.');
    test.done();
  }
};
