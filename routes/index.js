var express = require('express');
var router = express.Router();
var model = require('../model');

/* GET home page. */
router.get('/', function(req, res, next) {
  model.connect(function(db) {
    db.collection('users').find().toArray(function(err, docs) {
      // console.log('user docs', docs)
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

/* GET course page. */
router.get('/coursePage', function(req, res, next) {
    res.render('coursePage', {})
  })

/* GET all questions page. */
router.get('/allQuestionsPage', function(req, res, next) {
  var userMail = req.session.userMail || ''
  var page = req.query.page || 1
  var data = {
    total: 0, // total page number
    curPage: page,
    list: []  // all questions in curPage
  }
  var pageSize = 2
  model.connect(function(db) {
    db.collection('questions').find().toArray(function(err, docs) {
        console.log('allQuestions', err)
        var list = docs
        res.render('allQuestionsPage', {userMail: userMail, list: list, data: data});
    })
})
})

/* GET edit Question page. */
router.get('/editQuestionPage', function(req, res, next) {
  var userMail = req.session.userMail || ''
  var item = {
    q_title: '',
    q_type: '',
    q_description: '',
    q_answer: '',
    q_explaination: '',
    q_time: ''
}
  if (req.query.q_description) {
    console.log(req.query.q_description)
    model.connect(function(db) {
      db.collection('questions').findOne({q_type: req.query.q_type, q_description: req.query.q_description}, function(err, docs) {
          item = docs
          res.render('editQuestionPage', {userMail: userMail, item: item})
      })
  })} else {
    res.render('editQuestionPage', {userMail: userMail, item: item});
  }
})

/* GET testPaper page. */
router.get('/testPaperPage', function(req, res, next) {
  res.render('testPaperPage', {})
})

module.exports = router;
