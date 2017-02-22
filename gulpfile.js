const gulp = require('gulp')
const postcss = require('gulp-postcss')
const autoprefixer = require('autoprefixer')

gulp.task('default', () => gulp.src('src/**/*.css')
  .pipe(postcss([autoprefixer()]))
  .pipe(gulp.dest('dist'))
)
