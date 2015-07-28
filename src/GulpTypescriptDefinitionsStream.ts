/// <reference path="../typings/tsd.d.ts" />
import stream = require('stream');
import buffer = require('buffer');
var gutil = require('gulp-util');
var File = require('vinyl');

class GulpTypescriptDefinitionsStream extends stream.Readable
{
    files : any;
    paths : String[];
    ready: Boolean;
    queued: Boolean;

    constructor()
    {
        this.ready = false;
        this.files = [];
        this.paths = [];
        super({
            objectMode : true
        });
    }

    public addDefinitionFile(file) : void
    {
        this.paths.push(file.path);
        this.files.push(file);
    }

    public doneAddingDefintions() : void
    {
        this.ready = true;
        if (this.queued)
        {
            this._read();
        }
    }

    public _read() : void
    {
        var file = this.files.shift();
        if (file == undefined)
        {
            if (this.ready)
            {
                var summaryTsd: string = "";
                this.paths.forEach(function(itm,idx,array) {
                    summaryTsd += `/// <reference path="${itm}" />\n`;
                });
                this.push(new File({
                    path: "thrift.d.ts",
                    contents: new Buffer(summaryTsd, "utf8")
                }));
                this.push(null);
            }
            else
            {
                this.queued = true;
            }
        }
        else
        {
            this.push(file);
        }
    }
}

export = GulpTypescriptDefinitionsStream;
