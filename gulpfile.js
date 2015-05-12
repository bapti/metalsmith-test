var gulp = require('gulp');
var Metalsmith = require('metalsmith');
var markdown = require('metalsmith-markdown');
var templates = require('metalsmith-templates');
var collections = require('metalsmith-collections');
var permalinks  = require('metalsmith-permalinks');
var Handlebars = require('handlebars');
var metadata = require("./metadata.json");
var fs = require("fs");
var prettyjson = require('prettyjson');
var _ = require('lodash');

Handlebars.registerPartial('head', 
  fs.readFileSync(__dirname + '/templates/partials/_head.hbt').toString()
  );
Handlebars.registerPartial('nav', 
  fs.readFileSync(__dirname + '/templates/partials/_nav.hbt').toString()
  );
Handlebars.registerPartial('footer', 
  fs.readFileSync(__dirname + '/templates/partials/_footer.hbt').toString()
  );
Handlebars.registerPartial('post', 
  fs.readFileSync(__dirname + '/templates/partials/_post.hbt').toString()
  );


// var logMetaData = function(metadata){
//   console.log("Metalsmith metadata");
//   console.log("-------------------");
//   console.log("");

//   _.forOwn(metadata, function(item, key){
//     console.log("Metadata Item: " + key);
//     if(_.isArray(item)){
//       _.forEach(item, function(bit){
//         bit = _.omit(bit, 'contents');
//         console.log(bit);
//       })
//     } else {
//       console.log(item);
//     }
//     console.log("");
//   });

//   console.log("");
// };

// var logger = function(){
//   return function (files, metalsmith, done){
//     console.log("================== Start logger ===========");
//     console.log("");
//     logMetaData(metalsmith.metadata());
    
//     console.log("Files");
//     console.log("-------------------");
//     for (var file in files) {
//       console.log(file);
//     }
//     console.log("");
//     console.log("================== End logger =============");
//     done();
//   };
// };

// var metalsmithAssert = function(input){
//   return function(files, metalsmith, done){
//     console.log(metalsmith.metadata().collections);
//   }
// }

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
      console.log("Build finished");
      done(err);
    });

});