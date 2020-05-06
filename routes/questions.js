var express = require('express');
var router = express.Router();
var model = require('../model');
var moment = require('moment');

// INSERT QUESTION
router.post("/insert", function(req, res, next) {
    // if high similiarity question already exists, ...
    var data = {
        q_title: req.body.title,
        q_type: req.body.type,
        q_description: req.body.description,
        q_answer: req.body.answer,
        q_explaination: req.body.explaination,
        q_time: moment(Date.now()).format('YYYY-MM-DD HH:mm:ss')
    }
    if (req.body.q_time) {
        model.connect(function(db) {
            db.collection('questions').updateOne({q_time: req.body.q_time}, {$set: data}, function(err, ret) {
                if (err) {
                    console.log('update err!')
                } else {
                    console.log('updated!')
                }
            })
        })
    } else {
        model.connect(function(db) {
            db.collection('questions').insertOne(data, function(err, ret) {
                if (err) {
                    console.log('添加问题失败！', err)
                    res.redirect('/allQuestionsPage')
                } else {
                    res.redirect('/assignmentPage')
                }
            })
        })
    }
});

// EDIT QUESTION
router.get("/edit", function(req, res, next) {
    console.log('useless!')
    
});

// DELETE QUESTION
router.get("/delete", function(req, res, next) {
    model.connect(function(db) {
        db.collection('questions').deleteOne({q_time: req.query.q_time}, function(err, ret) {
            if (err) {
                console.log('Delete failed!')
            } else {
                console.log('Delete successfully')
            }
            res.redirect('/allQuestionsPage')
        })
    })
});

// SEARCH QUESTION(when creating an assignment)
router.post("/search", function(req, res, next) {
    model.connect(function(db) {
        // db.collection('questions').find({q_type: req.body.type}, {q_chapter: req.body.chapter}, {q_difficulty : {"$lte" : req.query.max_difficulty, "$gte" : req.query.min_difficulty}})
        db.collection('questions').find({q_type: req.body.type}).toArray(function(err, docs){
            var userMail = req.session.userMail || ''
            res.render('manuAddAssignmentPage', {preview: null, searchResult: docs, userMail: userMail, thisCourse: req.query.thisCourse, course_name: req.query.thisCourse.split('_')[0], course_inst: req.query.thisCourse.split('_')[1]})
        })
    })
});

// student submit a question, and auto-grading
router.post("/submitOneQuestion", function(req, res, next) {
    var thisAssignment = {
        a_name: req.query.a_name,
        a_release: req.query.a_release,
        a_due: req.query.a_due,
        a_questions: eval('['+req.query.a_questions+']')
    }
    req.session.stu_answers[req.query.q_id] = req.body.stu_answer
    console.log(req.body.stu_answer)
    console.log(req.session.stu_answers)
    model.connect(function(db) {
        db.collection('users').updateOne({ "user_name" : req.session.userName}, {$addToSet: {user_logs:{"q_assignment": thisAssignment.a_name, "q_id" : req.query.q_id, "q_percentage" : (req.body.stu_answer == req.query.q_right), "q_time":moment(Date.now()).format('YYYY-MM-DD HH:mm:ss')}}})
        db.collection('questions').find({q_id:{$in: thisAssignment.a_questions}}).toArray(function(err, docs) {
            res.render('oneAssignmentPage', {stu_answers: req.session.stu_answers, qSet: docs, userMail: req.session.userMail, thisAssignment: thisAssignment})
          })
    })
})

// GRADING CODING QUESTIONS

module.exports = router;
