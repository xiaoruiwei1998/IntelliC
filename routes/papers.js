var express = require('express');
var router = express.Router();
var model = require('../model');

/* Register */
router.post('/auto', function(req, res, next) {
  console.log('发布试卷')
})

module.exports = router;
