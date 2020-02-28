'use strict'
var path = require('path');
var gulp = require('gulp');
var browserSync = require('browser-sync').create();
var lazyLoadRev = require('./lazyLoadRev');
var fs = require('fs');

gulp.task('serve', function() {
    browserSync.init({
        server: "./",
        caseSensitive: true,
        port: 8082
    });

    gulp.watch('./sysConfig/**/*.html').on('change', browserSync.reload);
    gulp.watch('./js/**/*.js').on('change', browserSync.reload);


});



var concat = require('gulp-concat');
var filter = require('gulp-filter');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var htmlmin = require('gulp-htmlmin');
var del = require('del');
var runSequence = require('run-sequence');
var replace = require('gulp-replace');
var rev = require('gulp-rev');
var revCollector = require("gulp-rev-collector");

var fs = require('fs');
var cssmin = require('gulp-minify-css');

gulp.paths = {
    dist: 'PICCSX',
};



var paths = gulp.paths;
var revConfig = {
    rev: { //use rev to reset html resource url
        revJson: paths.dist + "/rev/**/*.json",
        src: "index.html", //root index.html
        dest: ""
    }
}






gulp.task('copy:js', function() {
    return gulp.src('./js/**/*')
        .pipe(gulp.dest(paths.dist + '/js'));
});


gulp.task('clean:dist', function() {
    return del(paths.dist);
});

gulp.task('copy:css', function() {
    return gulp.src('./css/**/*')
        .pipe(gulp.dest(paths.dist + '/css'));
});

gulp.task('copy:img', function() {
    return gulp.src('./images/**/*')
        .pipe(gulp.dest(paths.dist + '/images'));
});

gulp.task('copy:lib', function() {
    return gulp.src('./lib/**/*')
        .pipe(gulp.dest(paths.dist + '/lib'));
});

gulp.task('copy:html', function() {
    return gulp.src(['index.html', './piccSxHtml/**/*.html'])
        .pipe(gulp.dest(paths.dist + '/'));
});

gulp.task('copy:piccSxHtml', function() {
    return gulp.src('./piccSxHtml/**/*.html')
        .pipe(gulp.dest(paths.dist + '/piccSxHtml'));
});


gulp.task('build:dist', function(callback) {
    runSequence('clean:dist', 'copy:js', 'copy:css', 'copy:img', 'copy:lib', 'copy:piccSxHtml', 'js-rev', 'css-rev', 'revCollectorJs', 'replace-refhtmljs', callback);
});

/*js rev */
gulp.task('js-rev', function() {
    return gulp.src('./businessjs/**/*.js')
        .pipe(rev()) //set hash key
        .pipe(uglify())
        .pipe(gulp.dest('./PICCSX/businessjs'))
        .pipe(rev.manifest()) //set hash key json
        .pipe(gulp.dest('./PICCSX/businessjs')); //dest hash key json
});
/* html rev */
gulp.task('html-rev', function() {
    var options = {
        collapseWhitespace: true,
        collapseBooleanAttributes: true,
        removeComments: true,
        removeEmptyAttributes: true,
        removeScriptTypeAttributes: true,
        removeStyleLinkTypeAttributes: true,
        minifyJS: true,
        minifyCSS: true
    };
    return gulp.src('./piccSxHtml/**/*.html')
        .pipe(rev()) //set hash key
        .pipe(htmlmin(options))
        .pipe(gulp.dest('./PICCSX/piccSxHtml'))
        .pipe(rev.manifest()) //set hash key json
        .pipe(gulp.dest('./PICCSX/piccSxHtml')); //dest hash key json
});
gulp.task('css-rev', function() {
    return gulp.src(['./css/my.css', './css/style.css'])
        .pipe(rev()) //set hash key
        .pipe(gulp.dest('./PICCSX/css'))
        .pipe(rev.manifest()) //set hash key json
        .pipe(gulp.dest('./PICCSX/css')); //dest hash key json
});
/**html rev */
gulp.task('revCollectorJs', function() {
    return gulp.src(['./PICCSX/businessjs/*.json', './PICCSX/css/*.json', './*.html'])
        .pipe(revCollector({
            replaceReved: true,
            'businessjs/': '/PICCSX/businessjs/',
            'css/': '/PICCSX/css/'
        }))
        .pipe(gulp.dest('./PICCSX'));
});

gulp.task('replace-refhtmljs', function() {
    var data = fs.readFileSync('PICCSX/businessjs/rev-manifest.json', 'utf-8');
    var jsObj = JSON.parse(data);
    gulp.src(['PICCSX/**/*.html']).pipe(lazyLoadRev(jsObj)).pipe(gulp.dest('PICCSX'));
})
gulp.task('replace-refjshtml', function() {
    var data = fs.readFileSync('PICCSX/piccSxHtml/rev-manifest.json', 'utf-8');
    var htmlObj = JSON.parse(data);
    gulp.src(['PICCSX/**/*.js']).pipe(lazyLoadRev(htmlObj)).pipe(gulp.dest('PICCSX'));
})
gulp.task('default', ['serve']);