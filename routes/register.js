var express = require('express');
var router = express.Router();
var User = require('../models/User');
var crypto = require('crypto');

module.exports = router;

router.get('/', function(req, res) {
    res.render('register', {
        title: 'Register'
    });
});
