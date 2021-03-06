# gulp changelog

### 3.9.17
* Updated dependency tree to no longer contain glob-parent and its regex dos vulnerability

### 3.9.16
* Bumped dependency minimist version to fix vulnerability
* Bumped devDependency mkdirp version

### 3.9.15
* Added runSeq documentation to readme

### 3.9.14
* Purely internal maintenance updates

### 3.9.13
* Updated internal run-sequence (gulp.runSeq) to run in Node 13

### 3.9.12
* Nested dependencies downgraded to avoid redundant npm downloads

### 3.9.11
* Nested dependencies downgraded to avoid redundant npm downloads

### 3.9.10
* Fixed bin CLI for npm usage

### 3.9.9
* Updated package.json to fix installation of bin file
* Lessened the weight of dependencies for the bin CLI
* Added tests for the bin CLI
* Greatly reduced the overall number of NPM dependencies

### 3.9.8
* Unpublished

### 3.9.7
* Using vinyl-fs lts v3.0.4
* Letting chokidar disable fsevents for macOS El Capitan and lower

### 3.9.6
* Adding gulp.runSeq as an alias for gulp.runSequence
* Using @electric-eloquence/chokidar ^1.7.6, which uses fsevents 2.x, which uses Node's native N-API

### 3.9.5
* Acknowledgements in readme

### 3.9.4
* Minor maintenance and doc updates

### 3.9.3
* Better handling of renamed and removed directories
* Better handling of paths when cwd is submitted

### 3.9.2
* Updated documentation
* Continuous integration
* Removed deprecation from gulp.run method (but not exposing it publicly)
* Adding gulp.runSequence as a fully-supported method

### 3.9.1
* Beginning of long-term support for gulp major version 3
* Replacing Gaze with Chokidar with long-term support for major version 1
