var gulp        = require('gulp');
var sass        = require('gulp-sass')(require('sass'));
var concat      = require('gulp-concat');
var browserSync = require('browser-sync').create();

// Compile sass into CSS & auto-inject into browsers
gulp.task('sass', function() {
    return gulp.src("./public/sass/*.scss")
        .pipe(sass())
        .pipe(gulp.dest("./public/css"));
});

// move animate.css to web/css
gulp.task('animate', function() {
    return gulp.src('node_modules/animate.css/animate.css')
        .pipe(concat('animate.css'))
        .pipe(gulp.dest("../css"));
});

// move fontawesome.css to web/css
gulp.task('fontawesome', function() {
    return gulp.src('node_modules/@fortawesome/fontawesome-free/scss/fontawesome.scss')
        .pipe(sass())
        .pipe(concat('fontawesome.css'))
        .pipe(gulp.dest("./public/css"));
});

// move bootstrap JS and Jquery
gulp.task('js', function() {
    return gulp.src([
            'node_modules/jquery/dist/jquery.min.js',
            'node_modules/bootstrap/dist/js/bootstrap.bundle.min.js'
        ])
        .pipe(concat('jq-bs-bundle.js'))
        .pipe(gulp.dest('../js'));
});

// watching all tasks
gulp.task('serve', gulp.series('sass','js','animate','fontawesome', function() {
    gulp.watch("../sass/*.scss", gulp.series('sass'));
}));

// compile Fontawesome
gulp.task('fonta', gulp.series('fontawesome'));

// watching only scss task
gulp.task('styles', gulp.series('sass', function() {
    gulp.watch("./public/sass/*.scss", gulp.series('sass'));
}));

gulp.task('default', gulp.series('styles'));