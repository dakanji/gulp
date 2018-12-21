'use strict';

var gulp = require('../');
var should = require('should');
var join = require('path').join;
var rimraf = require('rimraf');
var fs = require('graceful-fs');

require('mocha');

var outpath = join(__dirname, './out-fixtures');
var timeout = 10;

describe('gulp runSequence()', function() {
  before(rimraf.sync.bind(null, outpath, {}));

  it('should run async callback tasks in series', function(done) {
    var a = '';
    var b = '0';
    var c = '1';
    var fn = function(cb) {
      a = a + b;
      cb();
    };
    var fn2 = function(cb) {
      a = a + c;
      cb();
    };
    gulp.task('test', fn);
    gulp.task('test2', fn2);
    gulp.task('default', function(cb) {
      gulp.runSequence('test', 'test2', cb);
    });
    gulp.run('default');
    a.should.equal('01');
    gulp.reset();
    done();
  });
  it('should run async stream tasks in series', function(done) {
    var fn = function() {
      return gulp.src(join(__dirname, './fixtures/copy/example.txt'))
        .pipe(gulp.dest(outpath));
    };
    var fn2 = function() {
      return gulp.src(join(outpath, './example.txt'))
        .pipe(gulp.dest(join(outpath, './run-sequence-series')));
    };
    gulp.task('test', fn);
    gulp.task('test2', fn2);
    gulp.task('default', function(cb) {
      gulp.runSequence(
        'test',
        'test2',
        function() {
          fs.readFile(join(outpath, './run-sequence-series/example.txt'), function(err, contents) {
            should.not.exist(err);
            should.exist(contents);
            String(contents).should.equal('this is a test');
            cb();
            gulp.reset();
            done();
          });
        }
      );
    });
    should(fs.existsSync(join(outpath, './example.txt'))).be.false;
    should(fs.existsSync(join(outpath, './run-sequence-series/example.txt'))).be.false;
    gulp.run('default');
  });
  it('should run async promise tasks in series', function(done) {
    var a = '';
    var b = '0';
    var c = '1';
    var fn = function() {
      return new Promise(function(resolve) {
        setTimeout(function() {
          a = a + b;
          resolve();
        }, 0);
      });
    };
    var fn2 = function() {
      return new Promise(function(resolve) {
        setTimeout(function() {
          a = a + c;
          resolve();
        }, 0);
      });
    };
    gulp.task('test', fn);
    gulp.task('test2', fn2);
    gulp.task('default', function(cb) {
      gulp.runSequence(
        'test',
        'test2',
        function() {
          a.should.equal('01');
          cb();
          gulp.reset();
          done();
        }
      );
    });
    gulp.run('default');
  });
  it('should run async callback tasks in parallel', function(done) {
    var start = Date.now();
    var fn = function(cb) {
      setTimeout(function() {
        cb();
      }, timeout);
    };
    var fn2 = function(cb) {
      setTimeout(function() {
        cb();
      }, timeout);
    };
    gulp.task('test', fn);
    gulp.task('test2', fn2);
    gulp.task('default', function(cb) {
      gulp.runSequence(
        ['test', 'test2'],
        function() {
          var elapsed = Date.now() - start;
          elapsed.should.be.below(timeout * 2);
          cb();
          gulp.reset();
          done();
        }
      );
    });
    gulp.run('default');
  });
  it('should run async stream tasks in parallel', function(done) {
    var start = Date.now();
    var start1;
    var start2;
    var stop1;
    var stop2;
    var fn = function() {
      return gulp.src(join(__dirname, './fixtures/copy/example.txt'))
        .pipe(gulp.dest(join(outpath, './run-sequence-parallel')));
    };
    var fn2 = function() {
      return gulp.src(join(__dirname, './fixtures/test.coffee'))
        .pipe(gulp.dest(join(outpath, './run-sequence-parallel')));
    };
    gulp.task('test', fn);
    gulp.task('test2', fn2);
    gulp.task('concurrent', function(cb) {
      start1 = Date.now();
      gulp.runSequence(
        'test',
        function() {
          stop1 = Date.now();
          cb();
        }
      );
    });
    gulp.task('concurrent2', function(cb) {
      start2 = Date.now();
      gulp.runSequence(
        'test2',
        function() {
          stop2 = Date.now();
          cb();
        }
      );
    });
    gulp.task('default', function(cb) {
      gulp.runSequence(
        ['concurrent', 'concurrent2'],
        function() {
          var elapsed = Date.now() - start;
          var elapsed1 = stop1 - start1;
          var elapsed2 = stop2 - start2;
          elapsed.should.be.below(elapsed1 + elapsed2);
          cb();
          gulp.reset();
          done();
        }
      );
    });
    gulp.run('default');
  });
  it('should run async promise tasks in parallel', function(done) {
    var start = Date.now();
    var fn = function() {
      return new Promise(function(resolve) {
        setTimeout(function() {
          resolve();
        }, timeout);
      });
    };
    var fn2 = function() {
      return new Promise(function(resolve) {
        setTimeout(function() {
          resolve();
        }, timeout);
      });
    };
    gulp.task('test', fn);
    gulp.task('test2', fn2);
    gulp.task('default', function(cb) {
      gulp.runSequence(
        ['test', 'test2'],
        function() {
          var elapsed = Date.now() - start;
          elapsed.should.be.below(timeout * 2);
          cb();
          gulp.reset();
          done();
        }
      );
    });
    gulp.run('default');
  });
});
