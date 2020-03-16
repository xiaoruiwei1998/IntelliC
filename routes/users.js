var express = require('express');
var router = express.Router();
var model = require('../model');
var bcrypt = require('bcrypt');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

/* Register */
router.post('/register', function(req, res, next) {

  var plaintextPassword = req.body.password;
  var saltRounds = 10;

  // pwd == pwd1?
  if (req.body.password != req.body.password1) {
    console.log('Different Password!') //怎么只重输pwd1？
    res.redirect('/registerPage')
  } else if(1) {
    // email regex checking

    // pattern = "\\w+@\w+(\.\w+)+$"
    // if (pattern.match(req.body.userMail)) {
    //   console.log("MATCHING!")
    // } else {
    //   console.log("Invalid Email Address!")
    //   res.redirect('/registerPage')
    // }

    // email already exists
    model.connect(function(db) {
      db.collection('users').findOne({user_email: req.body.userMail}, function(err, docs) {
        if (err) {
          console.log("Error: email already exists!")
          res.redirect('/registerPage')
        } else if (docs != null) {
            console.log("Account Already Exists!")
            res.redirect('/registerPage')
          } else {
            console.log(docs)
            console.log("Successfully Create an Account!")
          }
      })
    })
    bcrypt.genSalt(saltRounds, function(err, salt) {
      if (err) {
        res.redirect('/registerPage')
      } else {
          // save encrypted pwd and salt
          bcrypt.hash(plaintextPassword, saltRounds, function(err, hashedPwd) {
            if (err) {
              res.redirect('/registerPage')
            } else {
              // save data to db
              var data = {
                user_type: req.body.userType,
                user_name: req.body.username,
                user_email: req.body.userMail,
                user_password: hashedPwd,
                user_salt: salt,
                user_friends: [],
                user_assignments: []
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
      }
    })
  }
})



/* Login */
router.post('/loginPage', function(req, res, next) {
  var inputPassword = req.body.password
  var data = {
    user_email: req.body.userMail,
    user_inputPassword: req.body.password
  }

  // query
  model.connect(function(db) {
    // verify userMail
    db.collection('users').findOne({user_email: data.user_email}, function(err, docs) {
      if (err || docs == null) {
        console.log("User not exists!")
        res.redirect('/loginPage')
      } else {
          // verify password
          encryptPassword = docs['user_password']
          bcrypt.compare(inputPassword, encryptPassword, function(err, res1) {
            if (err) {
              res.redirect('/loginPage')
            } else if (res1 == false) {
              console.log("Incorrect Password!")
              res.redirect('/loginPage')
            } else {
              console.log("password is true")
              res.redirect('/')
            }
          })
          // save to session
          req.session.userMail = data.user_email
      }
    })
  })
  console.log('Login', data)
})

module.exports = router;
