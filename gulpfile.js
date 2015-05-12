var gulp = require('gulp');
var Metalsmith = require('metalsmith');
var markdown = require('metalsmith-markdown');
var templates = require('metalsmith-templates');
var collections = require('metalsmith-collections');
var permalinks  = require('metalsmith-permalinks');
var _ = require('lodash');
var metadata = require("./metadata.json");


var metalsmithAssert = function(input){
  return function(files, metalsmith, done){
    console.log(metalsmith.metadata().collections);
  }
}

gulp.task('default', [ 'build-html' ]);

gulp.task('build-html', function(done){

  Metalsmith("./")
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
      "engine": "handlebars"
    }))
    .build(function(err) {
      if (err){ console.log(err); }
      console.log("Build finished");
      done(err);
    });

});