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
var count = 0

/* Manu-add assignment */
router.post('/manuAddAssignment', function(req, res, next) {
  var thisAssignment = {
    a_name: req.body.a_name,
    a_courseID: req.query.thisCourse,
    a_release: req.body.a_release,
    a_due: req.body.a_due,
    a_questions: a_questionIds
  }
  a_questionIds = []
  a_preview = []
  model.connect(function(db) {
    db.collection('users').updateMany({"user_courses.course_id": req.query.thisCourse}, {$addToSet: {user_assignments: thisAssignment}}, function(err, ret) {
      if (err) {
        console.log('Add Assignment Failed!')
        } else {
            console.log(thisAssignment)
        }
        res.redirect('/coursePage?thisCourse='+req.query.thisCourse)
    })
  })
})

router.get('/addQ2A', function(req, res, next) {
  var qPreview = {
    q_type: req.query.q_type,
    q_title: req.query.q_title,
    q_description: req.query.q_description
  }
  if (a_questionIds.indexOf(req.query.q_id) == -1) {
    a_questionIds.push(req.query.q_id)
    a_preview.push(qPreview)
  }
  // console.log(a_questionIds)
  // console.log(a_preview)
  console.log("test")
  console.log(req.query.thisCourse)
  res.render('manuAddAssignmentPage', {preview: a_preview, searchResult: null, userMail: req.session.userMail, thisCourse: req.query.thisCourse, course_name: req.query.thisCourse.split('_')[0], course_inst: req.query.thisCourse.split('_')[1]})
})
/* autoGradingCode */
// router.post('/submitAssignment', function(req, res, next) {
//   thisLog = ''
//   model.connect(function(db) {
//     db.collection('users').updateOne({user_name:{req.query.user_name}}, {$addToSet: {user_logs: thisLog}}, function(err, ret) {
//       if (err) {
//         console.log('Add Log Failed!')
//         } else {
//             console.log('Add Log successfully')
//         }
//         res.redirect('/coursePage?thisCourse='+req.query.course_name+'_'+req.query.course_inst)
//     })
//   })
// })

// router.post('/editScore', function(req, res, next) {
//   model.connect(function(db) {
//     db.collection('users').updateOne({user_name:{req.query.user_name}}, {$Set: {user_logs: {percentage: req.query.newPercentage}}}, function(err, ret) {
//       if (err) {
//         console.log('Edit Score Failed!')
//         } else {
//             console.log('Edit Score successfully')
//         }
//         res.redirect('/coursePage?thisAssignment='+req.query.assignmentID+'_'+req.query.stu_email)
//     })
//   })
// })

module.exports = router;














