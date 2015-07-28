var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
/// <reference path="../typings/tsd.d.ts" />
var stream = require('stream');
var gutil = require('gulp-util');
var File = require('vinyl');
var GulpTypescriptDefinitionsStream = (function (_super) {
    __extends(GulpTypescriptDefinitionsStream, _super);
    function GulpTypescriptDefinitionsStream() {
        this.ready = false;
        this.files = [];
        this.paths = [];
        _super.call(this, {
            objectMode: true
        });
    }
    GulpTypescriptDefinitionsStream.prototype.addDefinitionFile = function (file) {
        this.paths.push(file.path);
        this.files.push(file);
    };
    GulpTypescriptDefinitionsStream.prototype.doneAddingDefintions = function () {
        this.ready = true;
        if (this.queued) {
            this._read();
        }
    };
    GulpTypescriptDefinitionsStream.prototype._read = function () {
        var file = this.files.shift();
        if (file == undefined) {
            if (this.ready) {
                var summaryTsd = "";
                this.paths.forEach(function (itm, idx, array) {
                    summaryTsd += "/// <reference path=\"" + itm + "\" />\n";
                });
                this.push(new File({
                    path: "thrift.d.ts",
                    contents: new Buffer(summaryTsd, "utf8")
                }));
                this.push(null);
            }
            else {
                this.queued = true;
            }
        }
        else {
            this.push(file);
        }
    };
    return GulpTypescriptDefinitionsStream;
})(stream.Readable);
module.exports = GulpTypescriptDefinitionsStream;
