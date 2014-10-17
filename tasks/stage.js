/*
 * grunt-stage
 * https://github.com/xavierpriour/grunt-stage
 *
 * Loads stage-dependent info in the 'stg' config variable.
 * This info can then be fed into other tasks config using '<%= stg.xxx%>' syntax.
 * 
 * Acceptable targets/arguments:
 * - stage:<stage> loads the info. Use as first task in a task list.
 * - stage:<stage>:<task>:<target/arguments> loads the info then runs the supplied task
 * (and its target/arguments if supplied). Useful for CLI use.
 * - stage:<task>:<arguments> calls <task>:<stage> if it exists, or does nothing.
 * This allows conditional operations (like only minify in for 'prod' stage).
 *
 * Copyright (c) 2014 Xavier Priour
 * Licensed under the MIT license.
 */
'use strict';

module.exports = function(grunt) {
  /*
   * all stage info are stored in grunt.config under this key
   */
  var stgKey = 'stg';
  var testKey = 'test';
  var cmdKey = 'cmd';
  var failKey = 'fail';
  /*
   * default folder for stage files. Overridden by options.dir
   */
  var defaultDir = 'config/secret';
  var defaultTest = false;

  grunt.config(stgKey, {});

  grunt.registerTask('stage', 'Loads stage-specific environment.', function(arg1, arg2, arg3) {
    var setTest = function(key, value) {
      if(!options.test) {
        return;
      }
      // grunt.config([stgKey, testKey, grunt.task.current.nameArgs, key], value);
      grunt.config([stgKey, testKey, key], value);
    };

    /*
     * Fails with supplied msg, UNLESS options.test is set, in which case it just sets stg.test.fail= msg.
     */
    var failUnlessTest = function(msg) {
      setTest(failKey, msg);
      if(options.test) {
        // do NOT fail in testing
        return;
      }
      grunt.fail.fatal(msg);
    };

    // all possible actions
    var actions = {
      // erases previous config
      'clear': {
        public: true,
        run: function() {
          grunt.config(stgKey, {});
        },
      },
      // prints current config on log.ok
      'dump': {
        public: true,
        run: function() {
          grunt.log.ok(JSON.stringify(grunt.config(stgKey), null, 2));
        },
      },
      // fails if a stage hasn't been defined yet
      'require': {
        public: true,
        run: function() {
          var stg = grunt.config(stgKey);
          if(!stg || !stg.stage) {
            failUnlessTest("stage must be set before that point, fix it by calling stage:<stage> in your tasks before.");
          }
        }
      },
      'loadAndRun': {
        public: false,
        run: function(stage, toRun) {
          if(stage) {
            var data;
            if (data = loadFile(stage)) {
              for (var attrname in data) {
                grunt.config([stgKey, attrname], data[attrname]);
              }
              grunt.config([stgKey, 'stage'], arg1);
            } else {
              failUnlessTest("unable to load requested stage '"+stage+"'.");
            }
          }
          if(toRun) {
            grunt.task.run(toRun);
          }
        }
      },
      '': {
        public: false,
        run: function() {
          grunt.log.writeln('skipping');
          // do nothing
        }
      }
    };

    // all possible input files for stage data
    var input = {
      'json': {
        read: function(fileName) {
          return grunt.file.readJSON(fileName);
        }
      },
      'json5': {
        read: function(fileName) {
          try {
            var json5 = require('json5');
            var fs = require('fs');
            var path = require('path');
            var filepath = path.resolve(process.cwd(), fileName);
            var raw = fs.readFileSync(filepath, 'utf8');
            return json5.parse(raw);
          } catch(err) {
            failUnlessTest("found stage config in json5 format but missing libary, please install with: npm install json5 --save-dep");
          }
        }
      }
    };

    /*
     * Returns true if a stage exists, false otherwise.
     * A stage exists if there is a .json or .json5 with its name in the <options.dir> directory.
     * This function does NOT check that the file is readable.
     */
    var isStage = function(stage) {
      var fileStart = options.dir+'/'+stage;
      for(var ext in input) {
        if(grunt.file.exists(fileStart+'.'+ext)) {
          return true;
        }
      }
      return false;
    };

    /*
     * Tries to load data for specified stage.
     * This should be in <options.dir>/<stage>.json or .json5.
     * Returns an Object, or false if no file was found.
     * Throws up a fail if a .json5 file was found but the JSON5 library is not installed.
     */
    var loadFile = function(stage) {
      var fileStart = options.dir+'/'+stage;
      for(var ext in input) {
        if(grunt.file.exists(fileStart+'.'+ext)) {
          return input[ext].read(fileStart+'.'+ext);
        }
      }
      return false;
    };

    // 1. get options, including defaults
    var options = this.options({
      dir: defaultDir,
      test: defaultTest,
    });

    // 2. parse task args into a command object
    var cmd = {
      command: '',
      args: [],
    };
    setTest(cmdKey, cmd);
    var task;
    // 2.a. is arg1 a command?
    if(actions[arg1] && actions[arg1].public) {
      cmd.command = arg1;
      if(typeof arg2 !== 'undefined') {
        cmd.args.push(arg2);
      }
      if(typeof arg3 !== 'undefined') {
        cmd.args.push(arg3);
      }
    }
    // 2.b. is arg1 a stage?
    else if(isStage(arg1)) {
      // we load arg1 as stage
      cmd.command = 'loadAndRun';
      cmd.args.push(arg1);
      // if arg2 and arg3 are present, we will run them > no check done on them!
      if(arg2) {
        task = arg2;
        if(arg3) {
          task += ':'+arg3;
        }
        cmd.args.push(task);
        // if(grunt.task.exists(arg2)) {
        //   task = arg2;
        //   if(arg3) {
        //     task += ':'+arg3;
        //   }
        //   grunt.log.debug("'"+arg1+"' stage running '"+task+"'");
        //   cmd.args.push(task);
        // } else {
        //   failUnlessTest("correct syntax is stage:<stage>:<task>, but '"+arg2+"' is not a task name.");
        // }
      }
    }
    // 2.c. is arg1 a task?
    else if (grunt.task.exists(arg1)) {
      // only valid if a stage has already been loaded
      var stage = grunt.config([stgKey, 'stage']);
      if(!stage) {
        failUnlessTest("stage must be set before calling stage:<task>, fix it by calling stage:<stage> before.");
      }
      // task target to run = stage name - does it exist?
      var target = grunt.config.get([arg1, stage]);
      if(target) {
        cmd.command='loadAndRun';
        cmd.args.push(null); // do not load anything
        task = arg1+':'+stage;
        if(arg3) {
          task += ':'+arg3;
        }
        grunt.log.debug("'"+stage+"' stage running '"+task+"'");
        cmd.args.push(task);
      } else {
        // just skip
        grunt.log.debug("no stage targets for task '"+arg1+"' and stage '"+stage+"', skipping it");
      }
    }
    // 2.d. we don't know what to do with arg1 > fail!
    else {
      failUnlessTest("incorrect arguments supplied to stage task, '"+arg1+"' should be either a stage (in folder '"+options.dir+"') or a task name.");
      return;
    }
    // 3. execute cmd object
    grunt.log.debug("Command is "+JSON.stringify(cmd, null, 2));
    var result;
    switch(cmd.args.length) {
      case 0:
        result = actions[cmd.command].run();
        break;
      case 1:
        result = actions[cmd.command].run(cmd.args[0]);
        break;
      case 2:
        result = actions[cmd.command].run(cmd.args[0], cmd.args[1]);
        break;
      case 3:
        result = actions[cmd.command].run(cmd.args[0], cmd.args[1], cmd.args[2]);
        break;
      default:
        result = actions[cmd.command].run(cmd.args);
        break;
    }
    return result;
  });
};