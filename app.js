var express = require('express');
var app = express();
var morgan = require('morgan');
var swig = require('swig');
var wikiRouter = require('./routes/')
var models = require('./models')
var Page = models.Page;
var User = models.User;

app.use(morgan('dev'));
models.User.sync({force:true}).then(function() {
  return models.Page.sync({force:true})
}).then(function() {
  app.listen(3000);
  console.log('server listening');
}).catch(console.error);

app.use(express.static('public'))
app.use('/wiki/', wikiRouter);

app.get('/users/:id', function(req,res,next){
  var userfind = User.findOne({
    where: {id: req.params.id}
  })
  var pagefind = Page.findAll({
    where: {authorId: req.params.id}
  })
  Promise.all([userfind,pagefind]).then(function(result){
    res.render('userpage',{user: result[0],pages: result[1]})
  })
})

app.get('/users', function(req,res,next) {
  var foundUsers = User.findAll({
    attributes: ['name', 'id']
  })

  foundUsers.then(function(results){
      res.render('userindex', {
        users: results
      })
    })
})

app.set('views', __dirname + '/views'); // point res.render to the proper directory
app.set('view engine', 'html'); // have res.render work with html files
app.engine('html', swig.renderFile); // when giving html files to res.render, tell it to use swig
swig.setDefaults({
  cache: false
});


