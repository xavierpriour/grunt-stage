'use strict';

var grunt = require('grunt');

exports.stage = {
  setUp: function(done) {
    // setup here if necessary
    done();
  },

  // stage:<stage> simple loading
  testStageLocal5IsLoaded: function(test) {
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
