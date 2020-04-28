var express = require('express');
var router = express.Router();
var model = require('../model');

router.post('/instAnalysis', function(req, res, next) {
    // model.connect(function(db) {
    //     avg = 0
    //     db.collection('users').aggregate({user_courses:{$all:{c_ID:[req.query.thisCourse]}}, {$avg:c_score}}, function(err, docs){
    //       if (err) {
    //         console.log('choose failed!')
    //       } else {
    //         avg = docs.
    //       }
    //     })
})

router.post('/stuAnalysis', function(req, res, next) {
    
  })