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

/* Manu-add assignment */
router.post('/manuAddAssignment', function(req, res, next) {
  console.log('manu发布试卷')
})



module.exports = router;
