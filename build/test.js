var assert = require('assert');
var es = require('event-stream');
var gutil = require('gulp-util');
var gulpthrift = require('./GulpTypescriptThrift');
/* global describe, it */
var path = require('path');
var fs = require('fs');
var chai = require('chai');
var expect = chai.expect;
describe('gulp-typescript-thrift', function () {
    it('should generate a javascript file', function (done) {
        var stream = new gulpthrift();
        var testFileContents = fs.readFileSync(path.join(__dirname, '../test/test.thrift'));
        var testFile = new gutil.File({
            path: path.join(__dirname, '../test/test.thrift'),
            contents: testFileContents
        });
        var i = 0;
        stream.on('data', function (data) {
            expect(path.extname(data.path)).equals('.js');
            if (i == 1) {
                done();
            }
            i++;
        });
        stream.write(testFile);
    });
});
