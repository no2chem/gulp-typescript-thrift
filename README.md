# Gulp-Typescript-Thrift

This gulp plugin generates typescript files from Thrift IDL.

## Prerequisites

This plugin requires a recent Thrift compiler (e.g. 0.9.2) with typescript support 
installed on your path.

## Usage

This plugin generates both .js files and the .d.ts files for typescript support.

Example usage:
```
gulp.task(“thrift”, function ()
{
    var tStream = new thrift();
    gulp.src(‘./thrift-src/*.thrift’)
        .pipe(tStream)
        .pipe(gulp.dest(‘./lib’));
    tStream.definitions.pipe(gulp.dest(‘typings/gen-thrift’));
}
);
```

This code snippet will import files from the **thrift-src** directory and generate
.js files in the **./lib** directory. Typescript defintions will be placed in the
**typings/gen-thrift** directory. 

In addition, the plugin generates a summary typescript file **thrift.d.ts** in
this directory. This means in every file you will use the thrift definitions, 
you will only need to add

```
/// <reference path=”../typings/gen-thrift/thrift.d.ts” />
```

to include all typings.

## Building

Naturally, this plugin uses gulp for its own build system. 

```
$ npm install
```

should install all the necessary dev dependencies, including the typescript 
compiler required to build, and the command

```
$ gulp
```

Will build the plugin and place it in the **build** directory.


