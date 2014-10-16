# grunt-stage

> Grunt task to easily manage building and deploying to various stages (environments), inspired by Capistrano.

**Synopsis:** define your test setup in `testing.json`, your production setup in `production.json`, and your `deploy` task in `Gruntfile.js`.
Then you can run `stage:testing:deploy` or `stage:production:deploy` to deploy (or build, test, minify,...) with the proper parameters.

**Why use it:**
- makes stage explicit: no more wondering **where** `grunt deploy` is deploying, when you do `grunt stage:production:deploy`
- shorter tasks/target list: no need for `build:production` and `build:dev` and `less:dist` and...
- adding another stage (another testing stage, a beta server, etc...) is quick and painless: just add another json config file.
- sensitive data (host, user, password,...) are centralized, outside your Gruntfile: data stay out of source control, Gruntfile stays in.

** Quick start:**
```shell
npm install grunt-stage --save-dev

mkdir -p config/secret
echo '{"server": "test.server.com"}' > config/secret/testing.json
echo '{"server": "prod.server.com"}' > config/secret/production.json
```
In Gruntfile.js
```
...
your_task {
  host: '<%= stg.server %>'
}
...
```
Then call:
- `grunt stage:production:your_task` => host: "prod.server.com".
- `grunt stage:testing:your_task` => host: "test.server.com".

## Install
This plugin requires Grunt `~0.4.5` - go to [gruntjs.com](http://gruntjs.com/getting-started) if you have never used it.

Install with NPM:
```shell
npm install grunt-stage --save-dev
```

If you want to use [JSON5](http://json5.org/) (for example to put comments in your config files - I highly recommend it), install it as well:
```shell
npm install json5 --save-dev
```

Once the plugin has been installed, load it in your Gruntfile.
I recommend [load-grunt-tasks](https://www.npmjs.org/package/load-grunt-tasks),
but you can do it the traditional, painful way by adding to your Gruntfile:
```js
grunt.loadNpmTasks('grunt-stage');
```

Make a directory to store your config files.
Default is `config/secret`, you can override it by setting `stage.options.dir`.
```shell
mkdir -p config/secret
```

Put your config files in that directory.
They can be JSON (extension `.json`) or [JSON5](http://json5.org/) (extension `.json5`) if you installed the library.
The names of the files will be the names of the stages, so choose wisely
(local, dev, test, staging, production,...).

## Usage

### Overview

There are 2 main ways of using stages:
- running the same target, with different values depending on the stage.
For example, deploying the code to different servers in production and testing.
This is done using `'<%= stg.<key> %>'` notation in the target definition.
- running different tasks or targets depending on the stage. For example,
minify code for production but not for local development.
This is done by calling `stage:<task>` instead of the `<task>`.

There are also 2 different ways of setting which stage you want to use:
- call the task with `stage:<stage>:<task>`, for example `stage:production:deploy`.
This is especially useful to select a stage on the command line.
- loading a stage as a first task (by calling `stage:<stage>`), then calling other tasks directly.
For example:
`grunt.registerTask('production', ['stage:production', 'clean', 'build', 'deploy']);`.
This is more useful to define "super-tasks" in your Gruntfile.

Finally, the stage task also include a few commands that are useful when building task chains.
They are `clear`, `dump`, and `require`, and are detailed below.

### Detailed syntax

All syntax is of the form `stage:arg1(:arg2:arg3) where arg2 and arg3 may be optional,
depending on the nature of arg1.
The task will first try to recognize arg1 as a command, then as a stage, then as a task - in that order.
So **beware of name collisions**, don't name your stages with the same name as a command or task.

#### stage:<command>
The task recognizes 3 commands:
- `stage:clear` removes all stage info. Useful if you're doing multiple deployments in a single task:
`grunt.registerTask('deploy_tests', ['stage:test1', 'deploy', 'stage:clear', 'stage:test2', 'deploy']);`.
- `stage:dump` prints out the currently loaded staging data. This is can be used to debug complex tasks.
- `stage:require` will stop grunt processing if no stage has been set when it runs.
Use it before starting tasks that use stage informations, to avoid any weird behavior.
For example: `grunt.registerTask('deploy', ['stage:require', 'build', 'ftp-deploy']);`.

#### stage:<stage>
Loads a stage, for later use.

Will look for `<stage>.json` in `options.dir` folder.
If the file does not exist, will look for `<stage>.json5` in the same folder.
It will then load the file info (and throw an error if a json5 file is found but the library is not installed).
The info will then be accessible in the grunt.config object under the key 'stg'.

This syntax is mostly used at the start of a list of tasks, for example:
```js
grunt.registerTask('production', ['stage:production', 'clean', 'build', 'deploy']);
```

#### stage:<task>:<optional arguments>
Conditional target: executes <task>:<stage> if it exists, or does nothing.

Looks for the specified task in the Gruntfile,
and then searches for a target with the same name as the current stage
(i.e. if the task is `build` and stage is `production`, looks for a target `production` under the `build` task).
It then runs this target, passing it any optional arguments.
If no corresponding target exists, the task does nothing (no error).

If that syntax is used before any stage is loaded, it will fail in error.

It is very useful for optional execution:
```js
...
minify {
  production: {...}
}
...
grunt.registerTask('build', ['less', 'stage:minify']);
```
Then `stage:production:build` will minify, but `stage:dev:build` won't.

#### stage:<stage>:<task>:<optional arguments>
Shortcut for [stage:<stage>, <task>:<optional arguments>].

Loads a stage and then execute the specified task.
Beware that the stage stays loaded for later tasks, it is not reset.

### Options

#### options.dir
Type: `String`
Default value: `'config/secret'`

The folder where all stage data files reside.

#### options.test
Type: `Boolean`
Default value: `false`

If set to `true`, the task will log a bunch of debug information in `grunt.config.stg.test`,
and will NOT fail on errors.
Only use for task testing - see examples in the `test` folder.

## Contributing
1. fork it: 
2. clone your fork.
3. install everything: `npm install`
4. test everything is ok: `grunt`
5. have a go!
6. add tests for your contribution
7. update that README
8. creade a pull request
9. enjoy the love

## Release History
__1.0.0__

  * first public version.
