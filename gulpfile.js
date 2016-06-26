var gulp = require('gulp');
var htmlmin = require('gulp-htmlmin');
var inject = require('gulp-inject');
var uglify = require('gulp-uglify');
var cleanCSS = require('gulp-clean-css');
var sourcemaps = require('gulp-sourcemaps');
var options = require('./gulp-options.js');
var clean = require('gulp-clean');

gulp.task('clean', function () {
    return gulp.src([
            options.destFolder('css'),
            options.destFolder('js'),
            options.destFolder('views'),
            options.destFolder('res'),
            options.destFolder('index.html')
        ], {read: false}
    ).pipe(clean());
});

// minify and copy css
gulp.task('build-css', function () {
    return gulp.src(options.cssFiles)
        //.pipe(sourcemaps.init())
        .pipe(cleanCSS())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(options.destFolder('css')));
});

// minify and copy js
gulp.task('build-js', function () {
    return gulp.src(options.jsFiles)
        .pipe(uglify())
        .pipe(gulp.dest(options.destFolder('js')));
});

// minify and copy views
gulp.task('build-views', function () {
    return gulp.src(options.viewFiles)
        .pipe(htmlmin({collapseWhitespace: true}))
        .pipe(gulp.dest(options.destFolder('views')));
});

// copy resources
gulp.task('build-resource', function () {
    return gulp.src(options.resFiles)
        .pipe(gulp.dest(options.destFolder('res')));
});

// copy index.html to destFolder
gulp.task('copy-index', function () {
    return gulp.src('index.html')
        .pipe(gulp.dest(options.destFolder()));
});

// inject destFolder css and js files to index
gulp.task('build-index', function () {
    var source = gulp.src([
            options.destFolder("**/*.js"),
            options.destFolder("**/*.css")
        ], {read: false}, {relative: true}
    );

    return gulp.src(options.destFolder('index.html'))
        .pipe(inject(source))
        //.pipe(htmlmin({collapseWhitespace: true}))
        .pipe(gulp.dest(options.destFolder()));
});


// just inject html and css files
gulp.task('default', function () {
    var source = gulp.src(
        options.filesToInject(),
        {read: false}, {relative: true}
    );
    return gulp.src('index.html')
        .pipe(inject(source))
        .pipe(gulp.dest(''));
});

// build all and put them in dist
gulp.task('build', [
    'clean',
    'build-css',
    'build-js',
    'build-views',
    'build-resource',
    'copy-index',
    'build-index',
    'default'
]);
