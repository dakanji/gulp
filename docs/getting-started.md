# Getting Started

#### 1. Install gulp globally:

__If you have previously installed a version of gulp globally, please run 
`npm rm --global gulp` to make sure your old version doesn't collide with 
gulp-cli.__

```shell
npm install --global gulp-cli
```

#### 2. Install gulp in your project devDependencies:

```shell
npm install --save-dev gulp
```

#### 3. Create a `gulpfile.js` at the root of your project:

```javascript
var gulp = require('gulp');

gulp.task('default', function() {
  // Place code for your default task here.
});
```

#### 4. Run gulp:

```shell
gulp
```

The default task will run and do nothing.

To run individual tasks, use `gulp <task> <othertask>`.

## Where do I go now?

You have an empty gulpfile and everything is installed. How do you REALLY get 
started? Check out the [recipes](recipes/README.md) and the 
[list of articles](README.md#articles) for more information.

## .src, .watch, .dest, CLI args - How do I use these things?

For API specific documentation you can check out the 
[documentation for that](API.md).

## Available Plugins

The gulp community is growing, with new plugins being added daily. See the 
[main website](https://gulpjs.com/plugins/) for a complete list.
