# Dealing with streams

> It is highly recommended to write plugins supporting streams. Here is some 
  information on creating a gulp plugin that supports streams.

> Make sure to follow the best practice regarding error handling and add the 
  line that make the gulp plugin re-emit the first error caught during the 
  transformation of the content

[Writing a Plugin](README.md) > Writing stream based plugins

## Dealing with streams

Let's implement a plugin prepending some text to files. This plugin supports 
all possible forms of file.contents.

```javascript
var through = require('through2');

var PLUGIN_NAME = 'gulp-prefixer';

function prefixStream(prefixText) {
  var stream = through();
  stream.write(prefixText);
  return stream;
}

// Plugin level function (dealing with files).
function gulpPrefixer(prefixText) {
  if (!prefixText) {
    throw new Error(PLUGIN_NAME + ': Missing prefix text!');
  }

  // Allocate ahead of time.
  prefixText = new Buffer(prefixText);

  // Create a stream through which each file will pass.
  var stream = through.obj(function(file, enc, cb) {
    if (file.isBuffer()) {
      this.emit('error', new Error(PLUGIN_NAME + ': Buffers not supported!'));
      return cb();
    }

    if (file.isStream()) {
      // Define the streamer that will transform the content.
      var streamer = prefixStream(prefixText);
      // Catch errors from the streamer and emit a gulp plugin error.
      streamer.on('error', this.emit.bind(this, 'error'));
      // Start the transformation.
      file.contents = file.contents.pipe(streamer);
    }

    // Make sure the file goes through the next gulp plugin.
    this.push(file);
    // Tell the stream engine that we are done with this file.
    cb();
  });

  // Return the file stream.
  return stream;
}

// Export the plugin main function.
module.exports = gulpPrefixer;
```

The above plugin can be used like this:

```javascript
var gulp = require('gulp');
var gulpPrefixer = require('gulp-prefixer');

gulp.src('files/**/*.js', { buffer: false })
  .pipe(gulpPrefixer('prepended string'))
  .pipe(gulp.dest('modified-files'));
```

## Some plugins using streams

* [gulp-svgicons2svgfont](https://github.com/nfroidure/gulp-svgiconstosvgfont)
