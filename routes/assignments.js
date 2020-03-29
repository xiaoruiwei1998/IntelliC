var express = require('express');
var router = express.Router();
var model = require('../model');

/* Auto add assignment */
router.post('/autoAdd', function(req, res, next) {
  console.log('自动发布试卷')
})

/* Manu add assignment */
router.post('/manuAdd', function(req, res, next) {
  console.log('manu发布试卷')
})



module.exports = router;
