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

/* GET register page. */
router.get('/registerPage', function(req, res, next) {
    res.render('registerPage', {})
  })

/* GET login page. */
router.get('/loginPage', function(req, res, next) {
  res.render('loginPage', {})
})

module.exports = router;
