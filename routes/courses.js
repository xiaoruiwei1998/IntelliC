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
        var new_course = req.body.courseName + '_' + req.session.userName // 每个课程唯一识别码 = course_name + inst_mail
        var this_course = {
                      course_id: new_course,
                      course_insts: [req.session.userName],
                      course_students: [],
                      course_assignments: []
                     }
        db.collection('courses').insertOne(this_course, function(err, ret) {})
        db.collection('users').updateOne({user_email: req.session.userMail}, {$addToSet: {user_courses: new_course}}, function(err, ret) {
          if (err) {
            console.log("inst add course err!")
          }
          res.redirect('/personalPage')
        })
      } else if (uType == 'S') {
        var new_course = {
          course_id: req.body.courseName + '_' + req.body.instName,
          course_grade: 0
        }
          db.collection('users').updateOne({user_email: req.session.userMail}, {$addToSet: {user_courses: new_course}}, function(err, ret) {
            if (err) {
              console.log("update users err!")
            }
          })
          console.log(new_course.course_id)
          db.collection('courses').updateOne({course_id: new_course.course_id}, {$addToSet:{"course_students": req.session.userMail}}, function(err, ret){
            if (err) {
              console.log("update courses err!")
            }
          })
          res.redirect('/personalPage')
      }
    })
  })

  module.exports = router;
