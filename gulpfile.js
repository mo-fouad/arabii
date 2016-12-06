
// declaring General Variables
var
    gulp = require('gulp'),                 //Preprocessing with Gulp
    sass = require('gulp-sass'),            // Requires the gulp-sass plugin
    browserSync = require('browser-sync').create(),              // browserSync plugin
    useref = require('gulp-useref'),        // linking all JS in the same file
    uglify = require('gulp-uglify'),        // Minify all JS in the same file
    gulpIf = require('gulp-if'),
    cssnano = require('gulp-cssnano'),      // Combining all css into one file
    imagemin = require('gulp-imagemin'),    // Optimizing images
    cache = require('gulp-cache'),          // Clearing cache
    del = require('del'),                   // Cleaning up generated files automatically
    runSequence = require('run-sequence');  // runSequence files

// Declaring General Roots
var
    sources =  {
        scss: [
            'app/scss/arabii.scss',
        ]
    }


/* ========== Gulp Tasks ========== */

// converting SASS files into CSS
gulp.task('sass', function(){
    return gulp.src(sources.scss)
        .pipe(sass()) // Converts Sass to CSS with gulp-sass
        .pipe(gulp.dest('app/css'))
        // Adding the link to set up the BrowserSync
        .pipe(browserSync.reload({
            stream: true
        }))
})

// Setting up browser Server to reload automatically
gulp.task('browserSync', function() {
    browserSync.init({
        server: {
            baseDir: 'app/'
        },
    })
})

// joining all JS in the same File
gulp.task('useref', function(){
    return gulp.src('app/*.html')
        .pipe(useref())
        .pipe(gulp.dest('dist'))

        // Minifies only if it's a JavaScript file
        .pipe(gulpIf('*.js', uglify()))

        // Minifies only if it's a CSS file
        .pipe(gulpIf('*.css', cssnano()))
        .pipe(gulp.dest('dist'))
});

// Optimizing images
gulp.task('images', function(){
    return gulp.src('app/images/**/*.+(png|jpg|jpeg|gif|svg)')
        .pipe(cache(imagemin({
            interlaced: true
        })))
        .pipe(gulp.dest('dist/images'))
});

// coping fonts to Dest
gulp.task('fonts', function() {
    return gulp.src('app/fonts/**/*')
        .pipe(gulp.dest('dist/fonts'))
})

// ##### -- Cleaning up generated files automatically
gulp.task('clean:dist', function() {
    return del.sync('dist');
})

// Adding Watch Task to fireup the server
gulp.task('watch',['browserSync','sass'] , function(){
    gulp.watch('app/scss/**/*.scss', ['sass']);

    // Other watchers
    // Reloads the browser whenever HTML or JS files change
    gulp.watch('app/*.html', browserSync.reload);
    gulp.watch('app/js/**/*.js', browserSync.reload);
})

// Buld ya bny

gulp.task('build', function (callback) {
    runSequence('clean:dist',
        ['sass', 'useref', 'images', 'fonts'],
        callback
    )
})

gulp.task('default', function (callback) {
    runSequence(['sass', 'useref','browserSync' , 'watch'],
        callback
    )
})
