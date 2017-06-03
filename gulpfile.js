var gulp           = require('gulp'),
		gutil          = require('gulp-util'),
		sass           = require('gulp-sass'),
		sourcemaps	   = require('gulp-sourcemaps'),
		browserSync    = require('browser-sync').create(),
		concat         = require('gulp-concat'),
		uglify         = require('gulp-uglify'),
		cleanCSS       = require('gulp-clean-css'),
		rename         = require('gulp-rename'),
		del            = require('del'),
		imagemin       = require('gulp-imagemin'),
		cache          = require('gulp-cache'),
		autoprefixer   = require('gulp-autoprefixer'),
		bourbon        = require('node-bourbon'),
		ftp            = require('vinyl-ftp'),
		environments   = require('gulp-environments')
		notify         = require("gulp-notify");

var development = environments.development;

// Скрипты проекта
gulp.task('scripts', function() {
	return gulp.src('app/src/**/*.js')
	.pipe(development(sourcemaps.init()))
	.pipe(concat('scripts.min.js'))
	.pipe(uglify())
	.pipe(development(sourcemaps.write()))
	.pipe(gulp.dest('app/js'))
	.pipe(browserSync.stream());
});

// js библиотеки
gulp.task('libs', function() {
	return gulp.src([
		'app/libs/jquery/dist/jquery.js',
		'app/libs/slick-carousel/slick/slick.js',
		'app/libs/angular/angular.js',
		'app/libs/angular-route/angular-route.js',
		'app/libs/angular-resource/angular-resource.js',
		'app/libs/angular-slick-carousel/dist/angular-slick.js'
		])
	.pipe(concat('scripts.libs.min.js'))
	.pipe(uglify())
	.pipe(gulp.dest('app/js'))
	.pipe(browserSync.stream());
});

gulp.task('browser-sync', function() {
	browserSync.init({
		server: {
			baseDir: 'app'
		},
		notify: false,
		// tunnel: true,
		// tunnel: "projectmane", //Demonstration page: http://projectmane.localtunnel.me
	});
});

gulp.task('sass', function() {
	return gulp.src('app/sass/main.scss')
	.pipe(development(sourcemaps.init()))
	.pipe(sass({
		includePaths: bourbon.includePaths
	}).on("error", notify.onError({
		message: "Error <%= error.message %>",
		title: "Sass Error!"
	})))
	.pipe(rename({suffix: '.min', prefix : ''}))
	.pipe(autoprefixer(['last 15 versions']))
	.pipe(cleanCSS())
	.pipe(development(sourcemaps.write()))
	.pipe(gulp.dest('app/css'))
	.pipe(browserSync.stream());
});

gulp.task('watch', ['sass', 'libs', 'scripts', 'browser-sync'], function() {
	gulp.watch('app/sass/**/*.+(sass|scss)', ['sass']);
	gulp.watch(['app/src/**/*.js'], ['scripts']);
	gulp.watch(['app/libs/**/*.js'], ['libs']);
	gulp.watch('app/**/*.html', browserSync.reload);
});

gulp.task('imagemin', function() {
	return gulp.src('app/img/**/*')
	.pipe(cache(imagemin()))
	.pipe(gulp.dest('dist/img')); 
});

gulp.task('build', ['removedist', 'imagemin', 'sass', 'scripts'], function() {

	var buildFiles = gulp.src([
		'app/*.html',
		'app/.htaccess',
		]).pipe(gulp.dest('dist'));

	var buildCss = gulp.src([
		'app/css/main.min.css',
		]).pipe(gulp.dest('dist/css'));

	var buildJs = gulp.src([
		'app/js/scripts.libs.min.js',
		'app/js/scripts.min.js',
		]).pipe(gulp.dest('dist/js'));

	var buildFonts = gulp.src([
		'app/fonts/**/*',
		]).pipe(gulp.dest('dist/fonts'));

});

gulp.task('deploy', function() {

	var conn = ftp.create({
		host:      'hostname.com',
		user:      'username',
		password:  'userpassword',
		parallel:  10,
		log: gutil.log
	});

	var globs = [
	'dist/**',
	'dist/.htaccess',
	];
	return gulp.src(globs, {buffer: false})
	.pipe(conn.dest('/path/to/folder/on/server'));

});

gulp.task('removedist', function() { return del.sync('dist'); });
gulp.task('clearcache', function () { return cache.clearAll(); });

gulp.task('default', ['watch']);
