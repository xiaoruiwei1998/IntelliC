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

a_questions = [0]
function choose(type, title, chapter) {
  model.connect(function(db) {
    db.collection('questions').find({q_type: type, q_title: title, q_chapter: chapter}, function(err, docs){
      if (err) {
        console.log('choose failed!')
      } else {
        a_questions.push(docs.q_id)
      }
    })
  })
}

/* Auto-add assignment */
router.post('/autoAddAssignment', function(req, res, next) {
  console.log('自动发布试卷')
  
})

/* Manu-add assignment */
router.post('/manuAddAssignment', function(req, res, next) {
  console.log('manu发布试卷')
  var thisAssignment = {
    a_name: req.query.a_name,
    a_release: req.query.a_release,
    a_due: req.query.a_due,
    a_questions: req.query.a_questions
  }
  model.connect(function(db) {
    db.collection('users').updateMany({user_courses:{$all:[req.query.thisCourse]}}, {$addToSet: {user_assignments: thisAssignment}}, function(err, ret) {
      if (err) {
        console.log('Add Assignment Failed!')
        } else {
            console.log('Add Assignment successfully')
        }
        res.redirect('/coursePage?thisCourse='+req.query.course_name+'_'+req.query.course_inst)
    })
  })
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














