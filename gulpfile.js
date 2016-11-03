var gulp = require('gulp'),
    coffee = require('gulp-coffee'),
    concat = require('gulp-concat'),
    gutil = require('gulp-util'),
    src = require('gulp-sourcemaps'),
    config = require('./config');

gulp.task('test', function () {
    console.log(config.public);
});

gulp.task('vendor:js', function () {
    return gulp.src([
        config.vendor + '/phaser.js'
    ])
    .pipe(concat('vendor.js'))
    .pipe(gulp.dest(config.public + '/js'))
})

gulp.task('coffee', ['includes', 'levels', 'mobs'], function () {
    return gulp.src([
        config.coffee + '/onload.coffee',
        config.coffee + '/config.coffee',
        config.coffee + '/boot.coffee',
        config.coffee + '/preload.coffee',
        config.coffee + '/menu.coffee'
    ])
    .pipe(coffee(config.coffeeConf)).on('error', gutil.log)
    .pipe(gulp.dest(config.public + '/js'))
})

gulp.task('levels', function () {
    return gulp.src(config.coffee + '/levels/*.coffee')
    .pipe(coffee(config.coffeeConf)).on('error', gutil.log)
    .pipe(gulp.dest(config.public + '/js/levels'))
})

gulp.task('mobs', function () {
    return gulp.src([
        config.coffee + '/mobs/**/**.coffee'
    ])
    .pipe(coffee(config.coffeeConf)).on('error', gutil.log)
    .pipe(gulp.dest(config.public + '/js/mobs'))
})

gulp.task('includes', function () {
    return gulp.src(config.coffee + '/includes/**/*.coffee')
    .pipe(coffee(config.coffeeConf).on('error', gutil.log))
    .pipe(gulp.dest(config.public + '/js/includes'))
})

gulp.task('scripts', ['coffee'], function () {
    return gulp.src([
        config.public + '/js/config.js',
        config.public + '/js/boot.js',
        config.public + '/js/preload.js',
        config.public + '/js/menu.js',
        config.public + '/js/includes/**/*.js',
        config.public + '/js/mobs/**/*.js',
        config.public + '/js/levels/*.js'
    ])
    .pipe(src.init())
    .pipe(concat(config.scriptsFileName))
    .pipe(src.write())
    .pipe(gulp.dest(config.public + '/js'));
})
