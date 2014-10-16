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

  // Project configuration.
  grunt.initConfig({
    jshint: {
      all: [
        'Gruntfile.js',
        'tasks/*.js',
        '<%= nodeunit.tests %>'
      ],
      options: {
        jshintrc: '.jshintrc'
      }
    },

    // This plugin does not generate any files, we're just using 'clean' as a test task!
    clean: {
      local: {},
      other:{},
    },

    // Configuration to be run (and then tested).
    stage: {
      options: {
        dir:'test/fixtures/',
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
  grunt.registerTask('_testLoad', ['stage:clear', 'stage:local', 'nodeunit:one:load']);
  grunt.registerTask('_testLoadJSON5', ['stage:clear', 'stage:local5', 'nodeunit:one:load5']);
  grunt.registerTask('_testWrong', ['stage:clear', 'stage:doesNotExist', 'nodeunit:one:wrong']);
  grunt.registerTask('_testClear', ['stage:local', 'stage:clear', 'nodeunit:one:clear']);
  grunt.registerTask('_testRequire', ['stage:clear', 'stage:local', 'stage:require', 'nodeunit:one:require']);
  grunt.registerTask('_testRequireKO', ['stage:clear', 'stage:require', 'nodeunit:one:requireKO']);
  grunt.registerTask('_testTask', ['stage:clear', 'stage:local', 'stage:clean', 'nodeunit:one:task']);
  grunt.registerTask('_testTaskNone', ['stage:clear', 'stage:localNone', 'stage:clean', 'nodeunit:one:taskNone']);
  grunt.registerTask('_testStageTask', ['stage:clear', 'stage:local:clean', 'nodeunit:one:stageTask']);
  grunt.registerTask('_testStageTaskTarget', ['stage:clear', 'stage:local:clean:other', 'nodeunit:one:stageTaskTarget']);

  // Let's make a task to run all _test*
  grunt.registerTask('testAll', 'runs all _test* tasks', function(){
    for(var name in grunt.task._tasks) {
      if(name.indexOf('_test') === 0) {
        grunt.task.run(name);
        console.log(name);
      }
    }
  });

  // By default, lint and run all tests.
  grunt.registerTask('default', ['jshint', 'testAll']);
};
