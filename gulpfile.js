var gulp = require('gulp');
var Metalsmith = require('metalsmith');
var markdown = require('metalsmith-markdown');
var templates = require('metalsmith-templates');
var handlebars = require('handlebars');
var metadata = require("./metadata.json");

gulp.task('default', [ 'build-html' ]);

gulp.task('build-html', function(done){

  Metalsmith("./")
    //.source("./src")
    .metadata( metadata )
    //.directory("./build")
    .use(markdown())
    .use(templates({
      "engine": "handlebars"
    }))
    .build(function(err) {
      done(err);
    });

});