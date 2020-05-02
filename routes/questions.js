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
            console.log(docs)
            res.render('manuAddAssignmentPage', {searchResult: docs, userMail: userMail, thisCourse: req.query.thisCourse, course_name: req.query.thisCourse.split('_')[0], course_inst: req.query.thisCourse.split('_')[1], qSet: req.query.qSet})
        })
    })
});

// ADD QUESTION TO AN ASSIGNMENT
router.post("/addQ2A", function(req, res, next) {
    var qSet = req.query.qSet.push(req.query.qid)
    res.render('manuAddAssignmentPage', {searchResult: req.query.searchResult, userMail: req.session.userMail, thisCourse: req.query.thisCourse, course_name: req.query.thisCourse.split('_')[0], course_inst: req.query.thisCourse.split('_')[1], qSet:qSet})
});

// SUBMIT CODING QUESTIONS
router.post("/submitCodingQuestion", function(req, res, next) {
    console.log('submitCodingQuestion')
    console.log("--------------------- req ---------------------------")
    console.log(req)
    console.log("--------------------- res ---------------------------")
    console.log(res)
})

// GRADING CODING QUESTIONS

module.exports = router;
