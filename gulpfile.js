/* --------- plugins --------- */

var	gulp        = require('gulp');
var	compass     = require('gulp-compass');
var	jade        = require('gulp-jade');
var	browserSync = require('browser-sync').create();
var	browserify  = require('gulp-browserify');
var	uglify      = require('gulp-uglify');
var	rename      = require("gulp-rename");
var	plumber     = require('gulp-plumber');
var	concat      = require('gulp-concat');
var	wiredep     = require('wiredep').stream;
var	useref      = require('gulp-useref');
var	gulpif      = require('gulp-if');
var	minifyCss   = require('gulp-minify-css');
var shell       = require('gulp-shell');
var filter		= require('gulp-filter');
var imagemin 	= require('gulp-imagemin');

/* --------- paths --------- */

var DEV_PATH = '_dev';

var	paths = {
		jade : {
			location    : DEV_PATH + '/markups/**/*.jade',
			compiled    : DEV_PATH + '/markups/_pages/*.jade',
			destination : './pages'
		},

		scss : {
			location    : DEV_PATH + '/styles/**/*.scss',
			entryPoint  : 'css/main.css'
		},

		compass : {
			entryPoint  : DEV_PATH + '/styles/main.scss',
			configFile  : 'config.rb',
			cssFolder   : 'css',
			scssFolder  : DEV_PATH + '/styles',
			imgFolder   :'./images'
		},

		js : {
			location    : DEV_PATH + '/scripts/main.js',
			plugins     : DEV_PATH + '/scripts/_plugins/*.js',
			destination : 'js'
		},

		fonts: {
			location	: DEV_PATH + '/fonts/**/*.+(eot|svg|ttf|woff|woff2)',
			destination : 'fonts'
		},

		images : {
			location	: DEV_PATH + '/images/**/*',
			destination : 'images'
		},

		browserSync : {
			baseDir : './',
			watchPaths : ['*.html', 'css/*.css', 'js/*.js']
		},

		indexBuilder : {
			location : DEV_PATH + '/index_builder.js'
		}
	}

/* --------- jade --------- */

gulp.task('jade', function() {
	var assets = useref.assets();

	gulp.src(paths.jade.compiled)
		.pipe(plumber())
		.pipe(jade({
			pretty: '\t',
		}))
		.pipe(wiredep({
			directory: DEV_PATH + '/bower'
		}))
		.pipe(assets)
		.pipe(gulpif('*.js', uglify()))
		.pipe(gulpif('*.css', minifyCss()))
		.pipe(assets.restore())
		.pipe(useref())
		.pipe(gulp.dest(paths.jade.destination));
});

/* --------- scss-compass --------- */

gulp.task('compass', function() {
	gulp.src(paths.scss.location)
		.pipe(plumber())
		.pipe(compass({
			config_file: paths.compass.configFile,
			css: paths.compass.cssFolder,
			sass: paths.compass.scssFolder,
			image: paths.compass.imgFolder
		}));
});

/* --------- browser sync --------- */

gulp.task('sync', function() {
	browserSync.init({
		server: {
			baseDir: paths.browserSync.baseDir
		}
	});
});

/* --------- plugins --------- */

gulp.task('plugins', function() {
	return gulp.src(paths.js.plugins)
		.pipe(plumber())
		.pipe(concat('plugins.min.js'))
		.pipe(uglify())
		.pipe(gulp.dest(paths.js.destination));
});

/* --------- scripts --------- */

gulp.task('scripts', function() {
	return gulp.src(paths.js.location)
		.pipe(plumber())
		.pipe(uglify())
		.pipe(rename('main.min.js'))
		.pipe(gulp.dest(paths.js.destination));
});

/*---------- fonts--------------*/

gulp.task('fonts', function() {
  gulp.src(paths.fonts.location)
    .pipe(filter(['*.eot','*.svg','*.ttf','*.woff','*.woff2']))
    .pipe(gulp.dest(paths.fonts.destination))
});

/*---------- images ------------*/

gulp.task('images', function () {
  return gulp.src(paths.images.location)
    .pipe(imagemin({
      progressive: true,
      interlaced: true
    }))
    .pipe(gulp.dest(paths.images.destination));
});
/* --------- index-page builder --------- */

gulp.task('exec', shell.task("node " + paths.indexBuilder.location));

/* --------- watch --------- */

gulp.task('watch', function(){
	gulp.watch(paths.jade.location, ['jade']);
	gulp.watch(paths.scss.location, ['compass']);
	gulp.watch(paths.js.location, ['scripts']);
	gulp.watch(paths.js.plugins, ['plugins']);
	gulp.watch(paths.jade.destination, ['exec']);
	gulp.watch(paths.browserSync.watchPaths).on('change', browserSync.reload);
});

/* --------- default --------- */

gulp.task('default', ['jade', 'compass', 'plugins', 'scripts', 'sync', 'exec', 'watch', 'images', 'fonts']);