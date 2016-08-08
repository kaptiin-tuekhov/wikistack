var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser')
var models = require('../models');
var Page = models.Page;
var User = models.User;

module.exports = router;

router.use(bodyParser.urlencoded());
router.use(bodyParser.json());

router.get('/',function(req,res){
  var foundPages = Page.findAll({
    attributes: ['title', 'urlTitle']
  })

  foundPages
    .then(function(results){
      res.render('index', {
        pages: results
      })
    })
})

router.get('/add', function(req,res,next) {
  res.render('addpage')
})

router.post('/',function(req,res,next) {
  User.findOrCreate({
    where: {name: req.body.author,
            email: req.body.author_email}
  }).then(function(result){
    var user = result[0];
    var page = Page.build({
      title: req.body.title,
      content: req.body.page_content_text,
      tags: req.body.tags.split(' ')
    })
    return page.save().then(function (page) {
      return page.setAuthor(user)
    })
  }).then(function(page) {
    res.redirect(page.get('route'));
  }).catch(next)
})



router.get('/:urltitle', function(req,res,next) {
  var pageTitle = req.params.urltitle
  var thisAuthor;

  var promiseresults = []
  Page.findOne({
    where: {
      urlTitle: pageTitle
    }
  })
  .then(function(foundPage) {
    promiseresults.push(foundPage)
    return foundPage.getAuthor();
  }).then(function(author){
    promiseresults.push(author)
  }).then(function() {
    foundPage = promiseresults[0];
    foundAuthor = promiseresults[1];
    res.render('wikipage', {
      title: foundPage.title,
      content: foundPage.content,
      urlTitle: foundPage.urlTitle,
      name: foundAuthor.name,
      id: foundAuthor.id,
      tags: foundPage.tags
    })
  })
  .catch(function(err){
    console.error(err)
  })
})


