var express = require('express');
var router = express.Router();
var model = require('../model');

/* GET home page. */
router.get('/', function(req, res, next) {
  model.connect(function(db) {
    db.collection('users').find().toArray(function(err, docs) {
      console.log('user docs', docs)
      res.render('index', { title: 'Express' });
    })
  })
});

/* GET register page. */
router.get('/registerPage', function(req, res, next) {
    res.render('registerPage', {})
  })

/* GET login page. */
router.get('/loginPage', function(req, res, next) {
  res.render('loginPage', {})
})

/* GET personal page. */
router.get('/personalPage', function(req, res, next) {
  model.connect(function(db) {
    db.collection('users').find().toArray(function(err, docs) {
      var list = docs
      res.render('personalPage', {list: list});
    })
  })
})

/* GET log page. */
router.get('/logPage', function(req, res, next) {
  res.render('logPage', {})
})

/* GET category page. */
router.get('/categoryPage', function(req, res, next) {
    res.render('categoryPage', {})
  })

/* GET all questions page. */
router.get('/allQuestionsPage', function(req, res, next) {
  var userMail = req.session.userMail || ''
  res.render('allQuestionsPage', {userMail: userMail})
})

/* GET testPaper page. */
router.get('/testPaperPage', function(req, res, next) {
  res.render('testPaperPage', {})
})

module.exports = router;
