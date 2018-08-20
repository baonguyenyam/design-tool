module.exports = function (gulp, $, browserSync) {
	gulp.task('copy-fonts', function () {
		return gulp.src([
				'./src/fonts/**.*',
			])
			.pipe(gulp.dest('./dist/fonts'));
	});
};
