var gulp = require('gulp');
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

var metalsmithAssert = function(input){
  return function(files, metalsmith, done){
    console.log(metalsmith.metadata().collections);
  }
}

gulp.task('default', [ 'build-html', 'build-sass' ]);

gulp.task('build-html', function(done){

  Metalsmith(__dirname)
    .source("src/content")
    .metadata( metadata )
    .use(collections({
      posts: {
        pattern: 'content/posts/*.md',
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

gulp.task('build-sass', function(done){
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
