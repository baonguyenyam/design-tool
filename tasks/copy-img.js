module.exports = function (gulp, $, browserSync) {
	gulp.task('copy-img', function () {
		return gulp.src([
				'./src/img/**.*',
			])
			.pipe(gulp.dest('./dist/img'));
	});
};
