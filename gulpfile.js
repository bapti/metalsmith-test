var gulp = require('gulp');
var Metalsmith = require('metalsmith');
var markdown = require('metalsmith-markdown');
var templates = require('metalsmith-templates');
var collections = require('metalsmith-collections');
var permalinks  = require('metalsmith-permalinks');
var Handlebars = require('handlebars');
var metadata = require("./metadata.json");


Handlebars.registerPartial('header', 
  fs.readFileSync(__dirname + '/templates/partials/header.hbt').toString()
  );
Handlebars.registerPartial('footer', 
  fs.readFileSync(__dirname + '/templates/partials/footer.hbt').toString()
  );

gulp.task('default', [ 'build-html' ]);

gulp.task('build-html', function(done){

  Metalsmith("./")
    .metadata( metadata )
    .use(collections({
      pages: {
        pattern: 'content/pages/*.md'
      },
      posts: {
        pattern: 'content/posts/*.md',
        sortBy: 'date',
        reverse: true
      }
    }))
    .use(markdown())
    .use(permalinks({
      pattern: ':collection/:title'
    }))
    .use(templates({
      "engine": "handlebars"
    }))
    .build(function(err) {
      done(err);
    });

});