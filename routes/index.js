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
  var userName = req.session.userName || ''
  var item = {}
  model.connect(function(db) {
    db.collection('users').findOne({user_email: userMail}, function(err, docs) {
      item = docs
      res.render('personalPage', {item: item, userMail: userMail, userType: userType, userName: userName});
    })
  })
})

/* GET analysis page. */
router.get('/analysisPage', function(req, res, next) {
  var userMail = req.session.userMail || ''
  var userType = req.session.userType || ''
  var userName = req.session.userName || ''
  var item = {}
  model.connect(function(db) {
    db.collection('users').findOne({user_email: userMail}, function(err, docs) {
      item = docs
      res.render('analysisPage', {item: item, userMail: userMail, userType: userType, userName: userName});
    })
  })
})

/* GET one assignment page. */
router.get('/oneAssignmentPage', function(req, res, next) {
  var userMail = req.session.userMail || ''
  var thisAssignment = {
    a_name: req.query.a_name,
    a_courseID: req.query.a_course,
    a_status: req.query.a_status,
    a_release: req.query.a_release,
    a_due: req.query.a_due,
    a_questions: eval('['+req.query.a_questions+']'), // String to Array
    a_stu_answers: eval('['+req.query.a_stu_answers+']')
  }
  model.connect(function(db) {
    db.collection('questions').find({q_id:{$in: thisAssignment.a_questions}}).toArray(function(err, docs) {
      console.log(docs)
      req.session.stu_answers = {}
      res.render('oneAssignmentPage', {stu_answers: req.session.stu_answers, qSet: docs, userMail: userMail, userName: req.session.userName, thisAssignment: thisAssignment})
    })
  })
})

/* GET course page. */
router.get('/coursePage', function(req, res, next) {
  var userMail = req.session.userMail || ''
  var userType = req.session.userType || ''
  var userName = req.session.userName || ''
  var thisCourse = req.query.thisCourse
  var course_name = thisCourse.split('_')[0]
  var course_inst = thisCourse.split('_')[1]
  model.connect(function(db) {
    db.collection('users').findOne({user_email: userMail}, function(err, docs) {
        var item = docs
        res.render('coursePage', {userMail: userMail, userType: userType, userName: userName, item: item, course_name:course_name, course_inst: course_inst, thisCourse: thisCourse});
    })
  })
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
        q_chapter: '',
        q_tags: '',
        q_difficulty: '',
        q_description: '',
        q_answer: '',
        q_explaination: '',
        q_time: ''
}
  if (req.query.q_time) {
    model.connect(function(db) {
      db.collection('questions').findOne({q_time: req.query.q_time}, function(err, docs) {
          item = docs
          res.render('editQuestionPage', {userMail: userMail, item: item})
      })
  })} else {
    res.render('editQuestionPage', {userMail: userMail, item: item});
  }
})

/* GET manuAddAssignmentPage page. */
router.get('/manuAddAssignmentPage', function(req, res, next) {
  var userMail = req.session.userMail || ''
  res.render('manuAddAssignmentPage', {preview: null, searchResult: null, userMail: userMail, thisCourse: req.query.thisCourse, course_name: req.query.thisCourse.split('_')[0], course_inst: req.query.thisCourse.split('_')[1]})
})

/* GET autoAssignmentPage page. */
router.get('/autoAddAssignmentPage', function(req, res, next) {
  var userMail = req.session.userMail || ''
  res.render('autoAddAssignmentPage', {userMail: userMail, course_name: req.query.thisCourse.split('_')[0], course_inst: req.query.thisCourse.split('_')[1]})
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
