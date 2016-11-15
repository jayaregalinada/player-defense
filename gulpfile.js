var gulp = require('gulp'),
    coffee = require('gulp-coffee'),
    concat = require('gulp-concat'),
    gutil = require('gulp-util'),
    src = require('gulp-sourcemaps'),
    clean = require('gulp-clean'),
    watch = require('gulp-watch'),
    sequence = require('run-sequence'),
    changed = require('gulp-changed')
    config = require('./config');

gulp.task('test', function () {
    console.log(config.public);
});

gulp.task('coffee', function () {
    return gulp.src([
        config.coffee + '/onload.coffee',
        config.coffee + '/config.coffee',
        config.coffee + '/boot.coffee',
        config.coffee + '/preload.coffee',
        config.coffee + '/menu.coffee'
    ])
    .pipe(coffee(config.coffeeConf)).on('error', function(error) {
        var displayErr = gutil.colors.red(error)
        gutil.log(displayErr)
        gutil.beep()
        this.emit('end')
    })
    .pipe(gulp.dest(config.public + '/js'))
    .on('end', recompile)
})

gulp.task('levels', function () {
    return gulp.src(config.coffee + '/levels/*.coffee')
    .pipe(changed(config.public + '/js/levels'))
    .pipe(coffee(config.coffeeConf)).on('error', gutil.log)
    .pipe(gulp.dest(config.public + '/js/levels'))
    .on('end', recompile)
})

gulp.task('mobs', function () {
    return gulp.src([
        config.coffee + '/mobs/**/**.coffee'
    ])
    .pipe(changed(config.public + '/js/mobs'))
    .pipe(coffee(config.coffeeConf)).on('error', gutil.log)
    .pipe(gulp.dest(config.public + '/js/mobs'))
    .on('end', recompile)
})

gulp.task('includes', function () {
    return gulp.src(config.coffee + '/includes/**/*.coffee')
    .pipe(changed(config.public + '/js/includes'))
    .pipe(coffee(config.coffeeConf).on('error', gutil.log))
    .pipe(gulp.dest(config.public + '/js/includes'))
    .on('end', recompile)
})

gulp.task('scripts', function () {
    return gulp.src([
        config.public + '/js/config.js',
        config.public + '/js/boot.js',
        config.public + '/js/preload.js',
        config.public + '/js/menu.js',
        config.public + '/js/includes/**/*.js',
        config.public + '/js/mobs/**/*.js',
        config.public + '/js/levels/*.js'
    ])
    // .pipe(changed(config.public + '/js'))
    .pipe(src.init())
    .pipe(concat(config.scriptsFileName))
    .pipe(src.write())
    .pipe(gulp.dest(config.public + '/js'))
})

gulp.task('clean', function() {
    return gulp.src(config.public + '/js')
    .pipe(clean())
    .on('end', function() {
        gutil.log('Finished cleaning')
    })
})

gulp.task('watch', function () {
    gulp.watch([
        config.coffee + '/onload.coffee',
        config.coffee + '/config.coffee',
        config.coffee + '/boot.coffee',
        config.coffee + '/preload.coffee',
        config.coffee + '/menu.coffee'
    ], ['coffee'])
    gulp.watch(config.coffee + '/levels/*.coffee', ['levels'])
    gulp.watch(config.coffee + '/mobs/**/**.coffee', ['mobs'])
    gulp.watch(config.coffee + '/includes/**/*.coffee', ['includes'])
})

var recompile = function () {
    gulp.start('scripts')
}

gulp.task('build', ['clean', 'coffee', 'levels', 'mobs', 'includes'], function () {
    return gulp.start('scripts')
})

gulp.task('default', ['build', 'watch'])
