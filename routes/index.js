const express = require('express');
const router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {

  let key = process.env.SCHOOLOGY_CONSUMER_KEY;
  let secret = process.env.SCHOOLOGY_CONSUMER_SECRET;

  res.render('index', { key: key, secret: secret });
});

module.exports = router;
