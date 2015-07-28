/// <reference path="../typings/tsd.d.ts" />
import stream = require('stream');
declare class GulpTypescriptDefinitionsStream extends stream.Readable {
    files: any;
    paths: String[];
    ready: Boolean;
    queued: Boolean;
    constructor();
    addDefinitionFile(file: any): void;
    doneAddingDefintions(): void;
    _read(): void;
}
export = GulpTypescriptDefinitionsStream;
