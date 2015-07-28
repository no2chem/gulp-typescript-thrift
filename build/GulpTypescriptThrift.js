/// <reference path="../typings/tsd.d.ts" />
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Promise = require('bluebird');
var stream = require('stream');
var path = require('path');
var GulpTypescriptDefinitionsStream = require('./GulpTypescriptDefinitionsStream');
var child_process = Promise.promisifyAll(require('child_process'));
var temp = Promise.promisifyAll(require('temp').track());
var gutil = require('gulp-util');
var File = require('vinyl');
var fs = Promise.promisifyAll(require('fs'));
var GulpTypescriptThrift = (function (_super) {
    __extends(GulpTypescriptThrift, _super);
    function GulpTypescriptThrift(opts) {
        _super.call(this, {
            objectMode: true
        });
        this.opts = {
            generator: "js:ts"
        };
        if (opts != undefined) {
            this.opts = opts;
        }
        this.definitions = new GulpTypescriptDefinitionsStream();
    }
    GulpTypescriptThrift.prototype._transform = function (chunk, encoding, callback) {
        var mObj = this;
        temp.mkdirAsync('gulpts')
            .then(function (tempDir) {
            child_process.execAsync("thrift -out " + tempDir + " --gen " + mObj.opts.generator + " " + chunk.path)
                .then(function (res) {
                fs.readdirAsync(tempDir)
                    .then(function (files) {
                    Promise.map(files, function (fileName) {
                        var fullPath = path.join(tempDir, fileName);
                        return fs.readFileAsync(fullPath)
                            .then(function (contents) {
                            return new File({
                                path: fileName,
                                contents: contents
                            });
                        })
                            .then(function (vinylFile) {
                            if (fullPath.indexOf('.d.ts', fullPath.length - '.d.ts'.length) !== -1) {
                                mObj.definitions.addDefinitionFile(vinylFile);
                            }
                            else {
                                mObj.push(vinylFile);
                            }
                        });
                    })
                        .then(function () {
                        callback();
                    });
                })
                    .catch(function (err) {
                    mObj.emit('error', new gutil.PluginError("gulp-typescript-thrift", "Couldn't get generated files " + err));
                    callback();
                });
            })
                .catch(function (err) {
                mObj.emit('error', new gutil.PluginError("gulp-typescript-thrift", "Couldn't execute thrift compiler " + err));
                callback();
            });
        })
            .catch(function (err) {
            mObj.emit('error', new gutil.PluginError("gulp-typescript-thrift", "Couldn't create temporary dir " + err));
        });
    };
    GulpTypescriptThrift.prototype._flush = function () {
        this.definitions.doneAddingDefintions();
    };
    return GulpTypescriptThrift;
})(stream.Transform);
module.exports = GulpTypescriptThrift;
