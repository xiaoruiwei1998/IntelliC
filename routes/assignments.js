var express = require('express');
var router = express.Router();
var model = require('../model');

/* Edit assignment */
router.get('/editAssignment', function(req, res, next) {
  console.log('编辑试卷')
  res.redirect('/coursePage?thisCourse='+req.query.course_name+'_'+req.query.course_inst)
});


/* Delete assignment */
router.get('/deleteAssignment', function(req, res, next) {
  console.log('删除试卷')
  model.connect(function(db) {
      db.collection('users').updateMany({}, {$pull: {user_assignments: {a_name: req.query.a_name}}}, function(err, ret) {
          if (err) {
              console.log('Delete failed!')
          } else {
              console.log('Delete successfully')
          }
          res.redirect('/coursePage?thisCourse='+req.query.course_name+'_'+req.query.course_inst)
      })
  })
});

/* Auto-add assignment */
router.post('/autoAddAssignment', function(req, res, next) {
  console.log('自动发布试卷')
  
})

var a_questionIds = []
var a_preview = []
var a_log = []

/* Manu-add assignment */
router.post('/manuAddAssignment', function(req, res, next) {
  var thisAssignment = {
    a_name: req.body.a_name,
    a_courseID: req.query.thisCourse,
    a_release: req.body.a_release,
    a_due: req.body.a_due,
    a_questions: a_questionIds,
    a_log: a_log
  }
  model.connect(function(db) {
    db.collection('users').updateMany({"user_courses.course_id": req.query.thisCourse}, {$addToSet: {user_assignments: thisAssignment}}, function(err, ret) {
      if (err) {
        console.log('Add Assignment Failed!')
        } else {
            console.log(thisAssignment)
        }
    })
  })
  a_questionIds = []
  a_preview = []
  a_log = []
  res.redirect('/coursePage?thisCourse='+req.query.thisCourse)
})

router.get('/addQ2A', function(req, res, next) {
  if (req.query.q_type == "MC" || req.query.q_type == "NMC") {
    var qPreview = {
      q_type: req.query.q_type,
      q_title: req.query.q_title,
      q_choices: req.query.q_choices,
      q_description: req.query.q_description
    }
  } else {
      var qPreview = {
        q_type: req.query.q_type,
        q_title: req.query.q_title,
        q_description: req.query.q_description
      }
  }
  if (a_questionIds.indexOf(req.query.q_id) == -1) {
    a_questionIds.push(req.query.q_id)
    a_preview.push(qPreview)
    a_log.push([req.query.q_id, null, req.query.q_difficulty, 0]) // 每张试卷的log{q_id:[学生答案，该题分数（难度），学生得分]}
  }
  console.log(a_log)
  res.render('manuAddAssignmentPage', {preview: a_preview, searchResult: null, userMail: req.session.userMail, thisCourse: req.query.thisCourse, course_name: req.query.thisCourse.split('_')[0], course_inst: req.query.thisCourse.split('_')[1]})
})

router.post('/submitAssignment', function(req, res, next) {
  res.redirect('coursePage?thisCourse='+req.query.thisCourse)
})

module.exports = router;














