var gulp = require('gulp'),
    babel = require('gulp-babel');

gulp.task('babelify', function () {
    return gulp.src('src/**/*.js')
        .pipe(babel({
            presets: ['es2015']
        }))
        .pipe(gulp.dest(''));
});

gulp.task('default', ['babelify'], function () {
    gulp.watch('src/**/*.js', ['babelify']);
});