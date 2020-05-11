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
    model.connect(function(db) {
        var thisAssignment = {
            a_courseID: req.query.a_course,
            a_name: req.query.a_name,
            a_release: req.query.a_release,
            a_due: req.query.a_due,
            a_questions: eval('['+req.query.a_questions+']'),
            a_log: null
        } 
        //找到原来的记录
        db.collection('users').findOne({ "user_name" : req.session.userName, "user_assignments.a_name": req.query.a_name},function(err, docs) {
            if (docs!=null) {
                docs = docs['user_assignments']
            }
            for (var i=0; i<docs.length; i++) {
                if (docs[i].a_name==req.query.a_name) {
                    thisAssignment.a_log = docs[i].a_log
                    if (req.query.q_type == "NMC") {
                        thisAssignment.a_log['\''+req.query.q_id+'\''] = []
                        for (var i=1; i<req.query.n; i++)  {
                            thisAssignment.a_log['\''+req.query.q_id+'\''].push(eval('req.body.stu_answer'+i))
                        }
                    } else if (req.query.q_type == "B") {
                        thisAssignment.a_log['\''+req.query.q_id+'\''] = []
                        for (var i=0; i<req.query.n; i++)  {
                            thisAssignment.a_log['\''+req.query.q_id+'\''].push(eval('req.body.stu_answer'+i))
                        }
                    } else {
                        var j=0
                        for (j=0; j<thisAssignment.a_log.length; j++){
                            if(thisAssignment.a_log[j][0]==req.query.q_id) {
                                break;
                            }
                        }
                        console.log("-------------Submit Question Debug-------------------")
                        console.log("1.-----"+thisAssignment.a_log)
                        var difficulty = thisAssignment.a_log[j][2]
                        thisAssignment.a_log.splice(j,1,[req.query.q_id, req.body.stu_answer, difficulty, (req.body.stu_answer==req.query.q_right)])
                        console.log("2.-----"+thisAssignment.a_log)
              
                    }
                }
              }

    })
          
        // 修改作业答案记录
        db.collection('users').updateOne({ "user_name" : req.session.userName, "user_assignments.a_name": thisAssignment.a_name}, {$set: {'user_assignments.$.a_log':thisAssignment.a_log}}, function(err, docs){
            console.log("=======update========"+thisAssignment.a_log)
        })
        // 修改学生答题记录
        db.collection('users').updateOne({ "user_name" : req.session.userName}, {$addToSet: {user_logs:{"q_assignment": thisAssignment.a_name, "q_id" : req.query.q_id, "q_percentage" : (req.body.stu_answer == req.query.q_right), "q_time":moment(Date.now()).format('YYYY-MM-DD HH:mm:ss')}}})
        // 取所有问题信息
        // db.collection('questions').find({q_id:{$in: thisAssignment.a_questions}}).toArray(function(err, docs) {
        //     res.redirect('/oneAssignmentPage?a_name='+thisAssignment.a_name+'&a_courseID='+thisAssignment.a_courseID+'&a_status='+'&a_release='+thisAssignment.a_release+'&a_due='+thisAssignment.a_due+'&a_questions='+thisAssignment.a_questions+'&a_log='+thisAssignment.a_log)
        // })

        db.collection('questions').find({q_id:{$in: thisAssignment.a_questions}}).toArray(function(err, docs) {
            res.render('oneAssignmentPage', {qSet: docs, userMail: req.session.userMail, thisAssignment: thisAssignment})
          })
        // console.log(req.body.stu_answer)
        // console.log(thisAssignment.a_log)
        // console.log(thisAssignment.a_questions)
        })
})

// GRADING CODING QUESTIONS

module.exports = router;
