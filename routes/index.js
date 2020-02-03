var express = require('express');
var router = express.Router();
var model = require('../model');

/* GET home page. */
router.get('/', function(req, res, next) {
  model.connect(function(db) {
    db.collection('users').find().toArray(function(err, docs) {
      console.log('user docs', docs)
      res.render('index', { title: 'Express' });
    })
  })
});

module.exports = router;
