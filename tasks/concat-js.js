module.exports = function(gulp, $, browserSync) {
    gulp.task('concat-js', function() {
        return gulp.src([
                'bower_components/jquery/dist/jquery.min.js',
                'bower_components/offline/offline.min.js',
                'bower_components/bootstrap/dist/js/bootstrap.bundle.min.js',
                // 'bower_components/owl.carousel/dist/owl.carousel.min.js',
                'bower_components/angular/angular.min.js',
                // 'bower_components/angular-animate/angular-animate.min.js',
                // 'bower_components/angular-sanitize/angular-sanitize.min.js',
                'bower_components/angular-bootstrap/ui-bootstrap.min.js',
                'bower_components/angular-bootstrap/ui-bootstrap-tpls.min.js',
                'src/vendor/html2canvas.min.js',
            ])
            .pipe($.concat('canhcam.js'))
            .pipe(gulp.dest('./dist/js'));
    });
};
