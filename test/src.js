'use strict';

var gulp = require('../');
var should = require('should');
var path = require('path');

require('mocha');

describe('gulp input stream', function() {
  describe('src()', function() {
    it('returns a stream', function(done) {
      var stream = gulp.src(path.join(__dirname, './fixtures/*.coffee'));
      should.exist(stream);
      should.exist(stream.on);
      done();
    });
    it('returns a input stream from a flat glob', function(done) {
      var stream = gulp.src(path.join(__dirname, './fixtures/*.coffee'));
      stream.on('error', done);
      stream.on('data', function(file) {
        should.exist(file);
        should.exist(file.path);
        should.exist(file.contents);
        path.join(file.path, '').should.equal(path.join(__dirname, './fixtures/test.coffee'));
        String(file.contents).should.equal('this is a test\n');
      });
      stream.on('end', function() {
        done();
      });
    });

    it('returns a input stream for multiple globs', function(done) {
      var globArray = [
        path.join(__dirname, './fixtures/stuff/run.dmc'),
        path.join(__dirname, './fixtures/stuff/test.dmc')
      ];
      var stream = gulp.src(globArray);

      var files = [];
      stream.on('error', done);
      stream.on('data', function(file) {
        should.exist(file);
        should.exist(file.path);
        files.push(file);
      });
      stream.on('end', function() {
        files.length.should.equal(2);
        files[0].path.should.equal(globArray[0]);
        files[1].path.should.equal(globArray[1]);
        done();
      });
    });

    it('returns a input stream for multiple globs, with negation', function(done) {
      var expectedPath = path.join(__dirname, './fixtures/stuff/run.dmc');
      var globArray = [
        path.join(__dirname, './fixtures/stuff/*.dmc'),
        '!' + path.join(__dirname, './fixtures/stuff/test.dmc')
      ];
      var stream = gulp.src(globArray);

      var files = [];
      stream.on('error', done);
      stream.on('data', function(file) {
        should.exist(file);
        should.exist(file.path);
        files.push(file);
      });
      stream.on('end', function() {
        files.length.should.equal(1);
        files[0].path.should.equal(expectedPath);
        done();
      });
    });

    it('returns a input stream with no contents when read is false', function(done) {
      var stream = gulp.src(path.join(__dirname, './fixtures/*.coffee'), { read: false });
      stream.on('error', done);
      stream.on('data', function(file) {
        should.exist(file);
        should.exist(file.path);
        should.not.exist(file.contents);
        path.join(file.path, '').should.equal(path.join(__dirname, './fixtures/test.coffee'));
      });
      stream.on('end', function() {
        done();
      });
    });
    it('returns a input stream with contents as stream when buffer is false', function(done) {
      var stream = gulp.src(path.join(__dirname, './fixtures/*.coffee'), { buffer: false });
      stream.on('error', done);
      stream.on('data', function(file) {
        should.exist(file);
        should.exist(file.path);
        should.exist(file.contents);
        var buf = '';
        file.contents.on('data', function(d) {
          buf += d;
        });
        file.contents.on('end', function() {
          buf.should.equal('this is a test\n');
          done();
        });
        path.join(file.path, '').should.equal(path.join(__dirname, './fixtures/test.coffee'));
      });
    });
    it('returns a input stream from a deep glob', function(done) {
      var stream = gulp.src(path.join(__dirname, './fixtures/**/*.jade'));
      stream.on('error', done);
      stream.on('data', function(file) {
        should.exist(file);
        should.exist(file.path);
        should.exist(file.contents);
        path.join(file.path, '').should.equal(path.join(__dirname, './fixtures/test/run.jade'));
        String(file.contents).should.equal('test template');
      });
      stream.on('end', function() {
        done();
      });
    });
    it('returns a input stream from a deeper glob', function(done) {
      var stream = gulp.src(path.join(__dirname, './fixtures/**/*.dmc'));
      var a = 0;
      stream.on('error', done);
      stream.on('data', function() {
        ++a;
      });
      stream.on('end', function() {
        a.should.equal(2);
        done();
      });
    });

    it('returns a file stream from a flat path', function(done) {
      var a = 0;
      var stream = gulp.src(path.join(__dirname, './fixtures/test.coffee'));
      stream.on('error', done);
      stream.on('data', function(file) {
        ++a;
        should.exist(file);
        should.exist(file.path);
        should.exist(file.contents);
        path.join(file.path, '').should.equal(path.join(__dirname, './fixtures/test.coffee'));
        String(file.contents).should.equal('this is a test\n');
      });
      stream.on('end', function() {
        a.should.equal(1);
        done();
      });
    });
  });
});
