'use strict';

const express = require('express');
const router = express.Router();
const indexActions = require(__dirname + '/../route_actions/index');


router.get('/', indexActions.loadIndexPage);

module.exports = router;
