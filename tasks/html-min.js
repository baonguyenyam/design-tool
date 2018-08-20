module.exports = function (gulp, $, browserSync) {
	gulp.task('html-min', function () {
		return gulp.src([
				'./dist/*.html',
			])
			.pipe($.htmlmin({collapseWhitespace: true}))
			.pipe(gulp.dest('./dist'))
	});
};
