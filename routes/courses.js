var express = require('express');
var router = express.Router();
var model = require('../model');

/* addCourse: 
  Instructor create new courses.
  Students add course from personalPage, then instructor accept the request.*/
router.post('/addCourse', function(req, res, next) {
    model.connect(function(db) {
      var uType = req.session.userType
      // If Inst: create new courses.
      if (uType == 'I') {
        var new_course = req.body.courseName + '_' + req.session.userMail // 每个课程唯一识别码 = course_name + inst_mail
        db.collection('users').updateOne({user_email: req.session.userMail}, {$addToSet: {user_courses: new_course}}, function(err, ret) {
          if (err) {
            console.log("inst add course err!")
          }
          res.redirect('/personalPage')
        })
      } else if (uType == 'S') {
        var new_course = req.body.courseName + '_' + req.body.instMail
        if (db.collection('users').find({user_name: req.body.instMail, user_courses: req.body.courseName})) {
          db.collection('users').updateOne({user_email: req.session.userMail}, {$addToSet: {user_courses: new_course}}, function(err, ret) {
            if (err) {
              console.log("stu add course err!")
            }
            res.redirect('/personalPage')
          })
        }
      }
    })
  })

  module.exports = router;