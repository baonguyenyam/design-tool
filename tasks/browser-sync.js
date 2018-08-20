module.exports = function (gulp, $, browserSync) {
	gulp.task('browser-sync', function () {
		browserSync.init({
			server: {
				baseDir: "./dist"
			}
		});
	});
};
