var gulp = require('gulp');
var gulpSequence = require('gulp-sequence');
var ghPages = require('gulp-gh-pages');
var Metalsmith = require('metalsmith');
var markdown = require('metalsmith-markdown');
var templates = require('metalsmith-templates');
var collections = require('metalsmith-collections');
var permalinks  = require('metalsmith-permalinks');
var sass  = require('metalsmith-sass');
var _ = require('lodash');
var metadata = require("./metadata.json");
var browserSync = require('browser-sync').create();
var path = require('path');
var del = require('del');

var metalsmithAssert = function(input){
  return function(files, metalsmith, done){
    console.log(metalsmith.metadata().collections);
  }
}

gulp.task('default', ['server']);

gulp.task('build', [
  'build-html', 
  'build-styles',
  'build-js'
]);

gulp.task('watch', function() {
  gulp.watch('./src/styles/**/*.scss', ['build-styles']);
  gulp.watch('./src/scripts/**/*.js', ['build-js']);
  gulp.watch('./src/content/**/*.md', ['build-html']);
  gulp.watch('./src/templates/**/*.jade', ['build-html']);
});

gulp.task('server', ['build', 'watch'], function() {
  browserSync.init({
    server: { baseDir: "./build" }
  });
  
  gulp.watch('./build/**/*.html').on("change", browserSync.reload);
  gulp.watch('./build/**/*.js').on("change", browserSync.reload);
  gulp.watch('./build/application.css').on("change", browserSync.reload);
});

gulp.task('build-html', function(done){

  try{
  Metalsmith(__dirname)
    .source("src/content")
    .clean(false)
    .metadata( metadata )
    .use(collections({
      posts: {
        pattern: 'posts/*.md',
        sortBy: 'date',
        reverse: true
      }
    }))
    .use(markdown())
    .use(permalinks({
      pattern: ':title-:date',
      date: 'YYYY'
    }))
    .use(templates({
      engine:   "jade"
      , pretty:   true
      //, inPlace:  true
    }))
    .build(function(err) {
      if (err){ 
        console.log(err); 
      }
      console.log("Build finished");
      done(err);
    });
  } catch (err) {
    console.log(err);
    done(err);
  }

});

gulp.task('build-styles', function(done){
  Metalsmith(__dirname)
    .source("src/styles")
    .clean(false)
    .use(sass({
      outputStyle: "expanded",
      file: './src/styles/application.scss',
      success: function(css){
        console.log(css);
      },
      error: function(error) {
        console.log(error);
      },
      includePaths: [
        './src/styles/bourbon',
        './src/styles/neat', 
        './src/styles/base'
      ]
    }))
    .build(function(err) {
      if (err){ 
        console.log(err); 
      }
      console.log("SASS finished");
      done(err);
    });
});

gulp.task('build-js', function(){

});

gulp.task('clean', function(done){
  return del('./build', done);
});

gulp.task('publish', 
  gulpSequence(
    'clean',
    'build',
    'deploy-gh-pages'
  )
);

gulp.task('deploy-gh-pages', function() {
  return gulp.src('./build/**/*')
    .pipe(ghPages({
      remoteUrl: "git@github.com:bapti/metalsmith-test.git",
      origin: "origin",
      //branch: "gh-pages",
      push: true,
      force: true
    }));
});