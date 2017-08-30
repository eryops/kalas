var gulp = require('gulp');
var cleanCSS = require('gulp-clean-css'); //minifying css
var concat = require('gulp-concat'); //to compileing js to one file
var less = require('gulp-less'); //to compiling less
var plumber = require('gulp-plumber'); //is used so gulp don't stop when js i wrong
var sourcemaps = require('gulp-sourcemaps'); //to se which less file the outputted css is in (do not use in production)
var uglify = require('gulp-uglify'); //minifying js
var gutil = require('gulp-util'); //to get error messages whit less whitout stoping gulp
var lessAutoprefix = require('less-plugin-autoprefix'); //adds autoprefixes for older browsers

// Define resource filePaths
var filePaths = {
  src: {
    'less': [
      'less/**/*.less',
    ],
    'js': [
      //'node_modules/jquery/dist/jquery.js',
      //'js/vendor/*.js',
      //'js/party/**/**/*.js'
    ],
    'fonts': [
      'node_modules/font-awesome/fonts/*'
    ]
  },
  dest: {
    'less' : 'css',
    'js'   : 'scripts',
    'fonts': 'fonts'
  },
};

var autoprefix = new lessAutoprefix({
  browsers: ['last 5 versions']
});


gulp.task('less', function() {
  return gulp.src(['less/main.less'], {base: 'less/'})
     .pipe(sourcemaps.init())
     .pipe(less({
       plugins: [autoprefix]
     }).on('error', function(err){
          gutil.log(err);
          this.emit('end');
      }))
     .pipe(cleanCSS())
     .pipe(sourcemaps.write())
     .pipe(gulp.dest(filePaths.dest.less));
});

gulp.task('fonts', function() {
  return gulp.src(filePaths.src.fonts)
    .pipe(gulp.dest(filePaths.dest.fonts));
});

// Concatenate and uglify JS
gulp.task('js', function() {
  gulp.src(filePaths.src.js)
    .pipe(plumber())
    .pipe(concat('main.js'))
    //.pipe(uglify())
    .pipe(gulp.dest(filePaths.dest.js));
});

// Production version of above tasks
gulp.task('production', function() {
  gulp.src(['less/main.less'], {base: 'less/'})
     .pipe(less({
       plugins: [autoprefix]
     }))
     .pipe(cleanCSS())
     .pipe(gulp.dest(filePaths.dest.less));

  gulp.src(filePaths.src.js)
    .pipe(concat('main.js'))
    .pipe(uglify())
    .pipe(gulp.dest(filePaths.dest.js));

    gulp.src(filePaths.src.fonts)
      .pipe(gulp.dest(filePaths.dest.fonts));
});

// Watch resource filePaths
gulp.task('watch', function() {
  gulp.watch(filePaths.src.less, ['less']);
  gulp.watch(filePaths.src.js, ['js']);
  gulp.watch(filePaths.src.fonts, ['fonts']);
});

// Setup default task
gulp.task('default', ['less', 'js', 'fonts', 'watch']);
//Production task
//gulp.task('default', ['production', 'watch']);
