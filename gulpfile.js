var gulp = require('gulp');
var Metalsmith = require('metalsmith');
var markdown = require('metalsmith-markdown');
var templates = require('metalsmith-templates');
var handlebars = require('handlebars');



gulp.task('default', function(done){
  console.log("test");
  done();
});

gulp.task('build', function(done){

  Metalsmith(__dirname)
    .use(markdown())
    .use(templates('handlebars'))
    .build(function(err) {
      done(err);
    });

});