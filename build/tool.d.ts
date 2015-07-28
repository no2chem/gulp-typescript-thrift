/// <reference path="../typings/tsd.d.ts" />
import stream = require('stream');
import GulpTypescriptDefinitionsStream = require('./GulpTypescriptDefinitionsStream');
declare class GulpTypescriptThrift extends stream.Transform {
    definitions: GulpTypescriptDefinitionsStream;
    constructor(opts?: any);
    _transform(chunk: any, encoding: string, callback: any): void;
    _flush(): void;
}
export = GulpTypescriptThrift;
