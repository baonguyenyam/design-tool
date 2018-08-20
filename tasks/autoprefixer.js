module.exports = function (gulp, $, browserSync) {
	gulp.task('autoprefixer', function () {
		return gulp.src([
				'./dist/css/main.css',
			])
			.pipe($.autoprefixer({
				browsers: [
					'last 2 versions',
					'iOS >= 7',
					'Android >= 4',
					'Explorer >= 10',
					'ExplorerMobile >= 11'
				],
				cascade: false
			}))
			.pipe(gulp.dest('./dist/css'));
	});
};
