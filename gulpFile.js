var gulp = require('gulp');
var babel = require('gulp-babel');
gulp.task('babel', function () {
  return gulp.src('scripts.js')
    .pipe(babel({
      presets: ['@babel/preset-env']
    }))
    .pipe(gulp.dest('dist'));
});
gulp.task('default', gulp.series('babel', ()=>{
  gulp.watch('scripts.js', gulp.series('babel'));
}));