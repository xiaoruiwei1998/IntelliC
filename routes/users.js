var express = require('express');
var router = express.Router();
var model = require('../model')

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

/* Register */
router.post('/registerPage', function(req, res, next) {
  // pwd == pwd1?
  if (req.body.password != req.body.password1) {
    console.log('Different Password!') //怎么只重输pwd1？
    res.redirect('/registerPage')
  } else if(0) {

  } else {

    // email verify

    // save data to db
    var data = {
      user_name: req.body.username,
      user_email: req.body.userMail,
      user_password: req.body.password,
      user_type: req.body.userType
    }
    model.connect(function(db) {
      db.collection('users').insertOne(data, function(err, ret) {
        if (err) {
          console.log('Register Failed!')
          res.redirect('/registerPage')
        } else {
          res.redirect('/loginPage')
        }
      })
    })
  }
})

/* Login */
router.post('/loginPage', function(req, res, next) {
  // pwd == pwd1?
  if (req.body.password != req.body.password1) {
    console.log('Different Password!') //怎么只重输pwd1？
    res.redirect('/registerPage')
  } else if(0) {

  } else {

    // save data to db
    var data = {
      user_email: req.body.userMail,
      user_password: req.body.password
    }
    model.connect(function(db) {
      db.collection('users').insertOne(data, function(err, ret) {
        if (err) {
          console.log('Register Failed!')
          res.redirect('/registerPage')
        } else {
          res.redirect('/loginPage')
        }
      })
    })
  }
})

module.exports = router;
