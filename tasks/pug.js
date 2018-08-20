module.exports = function (gulp, $, browserSync) {
	var fs = require('fs');
	gulp.task('tao-html', function () {
		var dataFile = './config.json';
		return gulp.src([
				'./src/templates/**/*.pug',
				'!./src/templates/{**/\_*,**/\_*/**}.pug'
			])
			.pipe($.plumber())
			.pipe($.data(function (file) {
				return JSON.parse(fs.readFileSync(dataFile));
			}))
			.pipe($.pug({
				pretty: true
			}))
			.pipe(gulp.dest('./dist'))
	});
};
