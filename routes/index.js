var express = require('express');
var router = express.Router();
var model = require('../model');

/* GET home page. */
router.get('/', function(req, res, next) {
  model.connect(function(db) {
    db.collection('users').find().toArray(function(err, docs) {
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
  var userMail = req.session.userMail || ''
  var userType = req.session.userType || ''
  var item = {}
  model.connect(function(db) {
    db.collection('users').findOne({user_email: userMail}, function(err, docs) {
      item = docs
      res.render('personalPage', {item: item, userMail: userMail, userType: userType});
    })
  })
})

/* GET analysis page. */
router.get('/analysisPage', function(req, res, next) {
  var userMail = req.session.userMail || ''
  var userType = req.session.userType || ''
  var item = {}
  model.connect(function(db) {
    db.collection('users').findOne({user_email: userMail}, function(err, docs) {
      item = docs
      res.render('analysisPage', {item: item, userMail: userMail, userType: userType});
    })
  })
})

/* GET log page. */
router.get('/oneAssignmentPage', function(req, res, next) {
  var userMail = req.session.userMail || ''
  res.render('oneAssignmentPage', {userMail: userMail})
})

/* GET course page. */
router.get('/coursePage', function(req, res, next) {
    var userMail = req.session.userMail || ''
    res.render('coursePage', {userMail: userMail})
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
    model.connect(function(db) {
      db.collection('questions').findOne({q_type: req.query.q_type, q_description: req.query.q_description}, function(err, docs) {
          item = docs
          res.render('editQuestionPage', {userMail: userMail, item: item})
      })
  })} else {
    res.render('editQuestionPage', {userMail: userMail, item: item});
  }
})

/* GET editAssignmentPage page. */
router.get('/editAssignmentPage', function(req, res, next) {
  var userMail = req.session.userMail || ''
  res.render('editQuestionPage', {userMail: userMail})
})

router.get('/chooseQuestionPage', function(req, res, next) {
  var userMail = req.session.userMail || ''
  var item = {
    q_title: '',
    q_type: '',
    q_description: '',
    q_answer: '',
    q_explaination: '',
    q_time: ''
}
  if (1) {
    model.connect(function(db) {
      db.collection('questions').find({q_type: req.query.q_type}, function(err, docs) {
          var list = docs
          res.render('chooseQuestionPage', {userMail: userMail, list: list})
      })
  })} else {
    res.render('chooseQuestionPage', {userMail: userMail, item: item});
  }
})
module.exports = router;
