'use strict';

var gulp = require('../');
var should = require('should');
var path = require('path');
var rimraf = require('rimraf');
var fs = require('fs');

require('mocha');

var outpath = path.join(__dirname, './out-fixtures');

describe('gulp output stream', function() {
  describe('dest()', function() {
    beforeEach(rimraf.sync.bind(null, outpath, {}));
    afterEach(rimraf.sync.bind(null, outpath, {}));

    it('returns a stream', function(done) {
      var stream = gulp.dest(path.join(__dirname, './fixtures/'));
      should.exist(stream);
      should.exist(stream.on);
      done();
    });

    it('returns an output stream that writes files', function(done) {
      var instream = gulp.src(path.join(__dirname, './fixtures/**/*.txt'));
      var outstream = gulp.dest(outpath);
      instream.pipe(outstream);

      outstream.on('error', done);
      outstream.on('data', function(file) {
        // Data should be re-emitted right
        should.exist(file);
        should.exist(file.path);
        should.exist(file.contents);
        path.join(file.path, '').should.equal(path.join(outpath, './copy/example.txt'));
        String(file.contents).should.equal('this is a test');
      });
      outstream.on('end', function() {
        fs.readFile(path.join(outpath, 'copy', 'example.txt'), function(err, contents) {
          should.not.exist(err);
          should.exist(contents);
          String(contents).should.equal('this is a test');
          done();
        });
      });
    });

    it('returns an output stream that does not write non-read files', function(done) {
      var instream = gulp.src(path.join(__dirname, './fixtures/**/*.txt'), { read: false });
      var outstream = gulp.dest(outpath);
      instream.pipe(outstream);

      outstream.on('error', done);
      outstream.on('data', function(file) {
        // Data should be re-emitted right
        should.exist(file);
        should.exist(file.path);
        should.not.exist(file.contents);
        path.join(file.path, '').should.equal(path.join(outpath, './copy/example.txt'));
      });
      outstream.on('end', function() {
        fs.readFile(path.join(outpath, 'copy', 'example.txt'), function(err, contents) {
          should.exist(err);
          should.not.exist(contents);
          done();
        });
      });
    });

    it('returns an output stream that writes streaming files', function(done) {
      var instream = gulp.src(path.join(__dirname, './fixtures/**/*.txt'), { buffer: false });
      var outstream = instream.pipe(gulp.dest(outpath));

      outstream.on('error', done);
      outstream.on('data', function(file) {
        // Data should be re-emitted right
        should.exist(file);
        should.exist(file.path);
        should.exist(file.contents);
        path.join(file.path, '').should.equal(path.join(outpath, './copy/example.txt'));
      });
      outstream.on('end', function() {
        fs.readFile(path.join(outpath, 'copy', 'example.txt'), function(err, contents) {
          should.not.exist(err);
          should.exist(contents);
          String(contents).should.equal('this is a test');
          done();
        });
      });
    });

    it('returns an output stream that writes streaming files into new directories', function(done) {
      testWriteDir({}, done);
    });

    it('returns an output stream that writes streaming files into new directories (buffer: false)', function(done) {
      testWriteDir({ buffer: false }, done);
    });

    it('return an output stream that writes streaming files into new directories (read: false)', function(done) {
      testWriteDir({ read: false }, done);
    });

    it('return an output stream that writes streaming files into new directories (read: false, buffer: false)', function(done) {
      testWriteDir({ buffer: false, read: false }, done);
    });

    function testWriteDir(srcOptions, done) {
      var instream = gulp.src(path.join(__dirname, './fixtures/stuff'), srcOptions);
      var outstream = instream.pipe(gulp.dest(outpath));

      outstream.on('error', done);
      outstream.on('data', function(file) {
        // Data should be re-emitted right
        should.exist(file);
        should.exist(file.path);
        path.join(file.path, '').should.equal(path.join(outpath, './stuff'));
      });
      outstream.on('end', function() {
        should(fs.existsSync(path.join(outpath, 'stuff'))).be.true;
        done();
      });
    }

  });
});
