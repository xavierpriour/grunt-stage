'use strict';

var grunt = require('grunt');

exports.stage = {
  setUp: function(done) {
    // setup here if necessary
    done();
  },

  // stage:<stage> simple loading
  testTestTaskWasRun: function(test) {
    test.expect(4);
    var expected = {
      cmd: {
        command: 'loadAndRun',
        args: ['local', 'testTask'],
      }
    };
    var actual = grunt.config('stg.test');
    test.deepEqual(actual, expected, 'stage:<stage>:<task> should load <stage> then run <task>.');
    test.equal(grunt.config('stg.stage'), 'local', "stage 'local' should be loaded");
    test.ok(grunt.file.exists('tmp/local'), 'task testTask:local should have run and created file');
    test.ok(grunt.file.exists('tmp/other'), 'task testTask:other should have run and created file');
    test.done();
  },
};
