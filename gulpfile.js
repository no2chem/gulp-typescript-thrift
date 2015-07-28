var gulp = require('gulp');
var ts = require('gulp-typescript');
var tsd = require('gulp-tsd');

var tsProject = ts.createProject({
    declarationFiles: true,
    noExternalResolve: false,
    sortOuptut: true,
    module: "commonjs"
});

gulp.task("ts-compile", function() {
    var tsResult = gulp.src(['src/*.ts', 'typings/**/*.ts'])
                       .pipe(ts(tsProject))
    tsResult.dts.pipe(gulp.dest('build'));
    return tsResult.js
                   .pipe(gulp.dest('build'));
});

gulp.task("ts-typings", function(cb)
          {
              tsd({
                  command: 'reinstall',
                  config: './tsd.json'
              }, cb);
          });

gulp.task("clean", function(cb) {
   del(['build','typings'], cb);
})

gulp.task('default', function()
          {
              gulp.start('ts-compile');
          })

gulp.task('watch', function() {
    gulp.watch('src/*.ts', ['ts-compile']);
})
