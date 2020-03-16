var express = require('express');
var router = express.Router();
var model = require('../model');

router.get('/', function(req, res, next) {
    res.send('respond with a resource');
  });

// INSERT QUESTION
router.post('/insert', function(req, res, next) {
    console.log('发布问题')
    var data = {
        date: Date.now(),
        title: req.body.title,
        type: req.body.type,
        description: req.body.description,
        answer: req.body.answer,
        explaination: req.body.explaination
    }
    model.connect(function(db) {
        console.log('连接数据库！')
        db.collection('questions').insertOne(data, function(err, ret) {
            if (err) {
                console.log('添加问题失败！', err)
                res.redirect('/allQuestionsPage')
            } else {
                console.log('添加问题成功！')
                res.redirect('/testPaperPage')
            }
        })
    })
});

module.exports = router;
