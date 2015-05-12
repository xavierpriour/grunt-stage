/*
 * grunt-stage
 * https://github.com/xavierpriour/grunt-stage
 *
 * Copyright (c) 2014 Xavier Priour
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {
  require('load-grunt-tasks')(grunt); // Load grunt tasks automatically

  var tmp = 'tmp/';
  var jsFiles = [
    'Gruntfile.js',
    'tasks/*.js',
    '<%= nodeunit.tests %>'
  ];

  // Project configuration.
  grunt.initConfig({
    jshint: {
      all: jsFiles,
      options: {
        jshintrc: '.jshintrc'
      }
    },

    jscs: {
      options: {
        config: '.jscsrc'
      },
      src: jsFiles
    },

    clean: [tmp],

    testTask: {
      local: {},
      other: {},
    },

    // Configuration to be run (and then tested).
    stage: {
      options: {
        dir:'test/fixtures',
        test: true,
      },
    },

    // Unit tests.
    nodeunit: {
      tests: ['test/*_test.js'],
      one: ['test/<%= grunt.task.current.args[0] %>_test.js'],
    }

  });

  // Actually load this plugin's task(s).
  grunt.loadTasks('tasks');

  // Due to the nature of the plugin, we can't put all tests into one task,
  // we need separate task paths to test all cases.
  grunt.registerTask('_testLoad',
    ['stage:clear', 'stage:local', 'nodeunit:one:localLoaded']);
  grunt.registerTask('_testLoadJSON5',
    ['stage:clear', 'stage:local5', 'nodeunit:one:load5']);
  grunt.registerTask('_testWrong',
    ['stage:clear', 'stage:doesNotExist', 'nodeunit:one:wrong']);
  grunt.registerTask('_testClear',
    ['stage:local', 'stage:clear', 'nodeunit:one:clear']);
  grunt.registerTask('_testRequire',
    ['stage:clear', 'stage:local', 'stage:require', 'nodeunit:one:require']);
  grunt.registerTask('_testRequireKO',
    ['stage:clear', 'stage:require', 'nodeunit:one:requireKO']);
  grunt.registerTask('_testTask',
    ['clean', 'stage:clear', 'stage:local', 'stage:testTask', 'nodeunit:one:task']);
  grunt.registerTask('_testTaskNone',
    ['stage:clear', 'stage:localNone', 'stage:testTask', 'nodeunit:one:taskNone']);
  grunt.registerTask('_testStageTask',
    ['stage:clear', 'stage:local:testTask', 'nodeunit:one:stageTask']);
  grunt.registerTask('_testStageTaskTarget',
    ['stage:clear', 'stage:local:testTask:other', 'nodeunit:one:stageTaskTarget']);
  grunt.registerTask('_testDefault', [
    'stage:clear',
    'stage:default:local',
    'nodeunit:one:localLoaded',
    'stage:default:localNone',
    'nodeunit:one:localLoaded'
  ]);

  grunt.registerTask('build', ['stage:testTask']);
  grunt.registerTask('_testChain',
    ['clean', 'stage:clear', 'stage:local', 'build', 'nodeunit:one:task']);

  // Let's make a task to run all _test*
  grunt.registerTask('testAll', 'runs all _test* tasks', function() {
    for (var name in grunt.task._tasks) {
      if (name.indexOf('_test') === 0) {
        grunt.task.run(name);
        console.log(name);
      }
    }
  });

  // this tasks create a file with the name of the target that was called
  // => makes it easy to test the task was actually run
  grunt.registerMultiTask('testTask', 'a test task to ensure grunt-stage runs properly', function() {
    grunt.log.writeln(this.target + ': ' + this.data);
    grunt.file.write(tmp + this.target, (new Date()).toString());
  });

  grunt.registerTask('test', [
    'jshint',
    'jscs',
    'testAll'
  ]);

  // By default, lint and run all tests.
  grunt.registerTask('default', ['test']);
};
