var gulp = require('gulp'),
    browserSync = require('browser-sync');


var files = [
    'index.html',
    'build/**'
];

gulp.task('watch', function(){
    browserSync.init(files, {
        server: {
            baseDir: '.'
        }
    });
});

gulp.task('default', ['watch']);
