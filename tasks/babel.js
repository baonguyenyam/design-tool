module.exports = function (gulp, $, browserSync) {
	gulp.task('tao-js', function () {
		return gulp.src([
				'./src/scripts/_core/*.js',
				'./src/scripts/*.js'
			])
			.pipe($.sourcemaps.init())
			.pipe($.concat('main.js'))
			.pipe($.babel())
			.pipe($.sourcemaps.write(''))
			.pipe(gulp.dest('./dist/js'));
	});
};
