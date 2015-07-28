/// <reference path="../typings/tsd.d.ts" />

import Promise = require('bluebird');
import stream = require('stream');
import path = require('path');
import GulpTypescriptDefinitionsStream = require('./GulpTypescriptDefinitionsStream');

var child_process : any = Promise.promisifyAll(require('child_process'));
var temp : any = Promise.promisifyAll(require('temp').track());
var gutil = require('gulp-util');
var File = require('vinyl');
var fs : any = Promise.promisifyAll(require('fs'));

class GulpTypescriptThrift extends stream.Transform {

    definitions : GulpTypescriptDefinitionsStream;
    opts = {
        generator: "js:ts"
    };

    constructor(opts? : any) {
        super({
            objectMode: true
        });
        if (opts != undefined)
        {
            this.opts = opts;
        }
        gutil.log("opts = " + this.opts);
        this.definitions = new GulpTypescriptDefinitionsStream();
    }

    public _transform(chunk : any, encoding : string, callback) : void {
        var mObj : GulpTypescriptThrift = this;
        temp.mkdirAsync('gulpts')
            .then(function(tempDir) {
                child_process.execAsync(`thrift -out ${tempDir} --gen ${mObj.opts.generator} ${chunk.path}`)
                    .then(function(res) {
                        fs.readdirAsync(tempDir)
                            .then(function(files)
                                    {
                                        Promise.map(files, function(fileName) {
                                            var fullPath = path.join(tempDir, fileName);
                                            return fs.readFileAsync(fullPath)
                                                .then(function (contents) {
                                                    return new File({
                                                        path: fileName,
                                                        contents: contents
                                                    })
                                                })
                                                .then(function(vinylFile) {
                                                    if (fullPath.indexOf('.d.ts', fullPath.length - '.d.ts'.length) !== -1)
                                                    {
                                                        mObj.definitions.addDefinitionFile(vinylFile);
                                                    }
                                                    else
                                                    {
                                                        mObj.push(vinylFile);
                                                    }
                                                });
                                        })
                                        .then(function()
                                                {
                                                    callback();
                                                })
                                    })
                            .catch(function (err) {
                                mObj.emit('error', new gutil.PluginError("gulp-typescript-thrift", `Couldn't get generated files ${err}`));
                                callback();
                            });
                    })
                    .catch(function(err)
                            {
                                mObj.emit('error', new gutil.PluginError("gulp-typescript-thrift", `Couldn't execute thrift compiler ${err}`));
                                callback();
                            });
            })
            .catch(function (err)
                    {
                        mObj.emit('error', new gutil.PluginError("gulp-typescript-thrift", `Couldn't create temporary dir ${err}`));
                    });
    }

    public _flush() : void {
        this.definitions.doneAddingDefintions();
    }
}
export = GulpTypescriptThrift;
