var gulp = require('gulp');
var sequence = require('gulp-sequence');
var Metalsmith = require('metalsmith');
var markdown = require('metalsmith-markdown');
var templates = require('metalsmith-templates');
var collections = require('metalsmith-collections');
var permalinks  = require('metalsmith-permalinks');
var sass  = require('metalsmith-sass');
var _ = require('lodash');
var metadata = require("./metadata.json");
var jade = require("jade");
var neat = require('node-neat');
var bourbon = require('node-bourbon');
var browserSync = require('browser-sync').create();

var metalsmithAssert = function(input){
  return function(files, metalsmith, done){
    console.log(metalsmith.metadata().collections);
  }
}

gulp.task('default', 
  sequence( 
    'build',
    'watch',
    'server'
  )
);

gulp.task('build', [
  'build-html', 
  'build-styles' 
]);

gulp.task('watch', function(){
  gulp.watch('./src/content/**/*', ['build-html']);
  gulp.watch('./templates/**/*', ['build-html']);
  gulp.watch('./src/styles/**/*', ['build-styles']);
});

gulp.task('server', ['watch'], function() {
  return browserSync.init([
    'build/*.js', 
    'build/application.css', 
    'build/index.html'
  ], 
  {
    server: {
        baseDir: "./build"
    }
  });
});

gulp.task('build-html', function(done){

  Metalsmith(__dirname)
    .source("src/content")
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

});

gulp.task('build-styles', function(done){
  Metalsmith(__dirname)
    .source("src/styles")
    .use(sass({
      outputStyle: "expanded",
      file: './src/styles/application.scss',
      success: function(css){
        console.log(css);
      },
      error: function(error) {
        console.log(error);
      },
      includePaths: bourbon.includePaths.concat( neat.includePaths )
    }))
    .build(function(err) {
      if (err){ 
        console.log(err); 
      }
      console.log("SASS finished");
      done(err);
    });
});
