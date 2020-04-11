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

module.exports = router;
