var 
	gulp 			= require('gulp'),
	runSequence 	= require('run-sequence'),
	sourcemaps 		= require('gulp-sourcemaps'),
	babel 			= require('gulp-babel'),
	concat 			= require('gulp-concat'),
	watch 			= require('gulp-watch'),
	batch 			= require('gulp-batch'),
 	uglify 			= require('gulp-uglify'),
 	clean 			= require('gulp-clean');


var allJS = ['src/common/commonUtil.js',
				'src/common/commonComponent.js',
				'src/swipe_navigation_plugin.js',
				'src/swipe_step_mover_plugin.js',
	 			'src/swipe_es6.js'];


gulp.task('cleanDist', function() {
	gulp.src("dist/*.*", {read: false})
			.pipe(clean())
});


gulp.task('compileBabelAMD', function() {
	 gulp.src(allJS)
			.pipe(concat('swipe_merge_es5.min.js'))
	        .pipe(sourcemaps.init())
	        .pipe(babel({
	        	//for supporting this below code, you have to add 'module export' code in source.
	        	//plugins: ['transform-es2015-modules-amd'], 
	        	 plugins : [
	        	 	['transform-es2015-classes', {loose: true}],
      			 	'transform-proto-to-assign'
      			 ]
	        }))
	        .pipe(babel({
	        	presets: ['es2015']
	        }))
	        .pipe(uglify())
	        .pipe(sourcemaps.write('.'))
	        .pipe(gulp.dest('dist'))
});

gulp.task('devCompileBabelAMD', function() {
	 gulp.src(allJS)
			.pipe(concat('swipe_merge_es5.js'))
	        .pipe(sourcemaps.init())
	        .pipe(babel({
	        	//for supporting this below code, you have to add 'module export' code in source.
	        	//plugins: ['transform-es2015-modules-amd'], 
	        	 plugins : [
	        	 	['transform-es2015-classes', {loose: true}],
      			 	'transform-proto-to-assign'
      			 ]
	        }))
	        .pipe(babel({
	        	presets: ['es2015']
	        }))
	        .pipe(sourcemaps.write('.'))
	        .pipe(gulp.dest('dist'))
});



gulp.task('buildJS', function() {
	runSequence(
		//'cleanDist', 'compileBabelAMD'
		'cleanDist', 'devCompileBabelAMD'
	);
});

gulp.task('watchSwipe', function() {
    	watch(['src/*.js', 'src/common/*.js'] , batch(function(events, done) { 
    		gulp.start('buildJS', done);
	    }));
});

gulp.task('default', function() {
	runSequence(
		'buildJS', 'jsBuild'  //use Array for parallel work.
	);
});