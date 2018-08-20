module.exports = function (gulp, $, browserSync) {
	gulp.task('copy-db', function () {
		return gulp.src([
				'./src/db/**.*',
			])
			.pipe(gulp.dest('./dist/db'));
	});
};
