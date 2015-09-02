var express = require('express');
var router = express.Router();
var User = require('../models/user');
var crypto = require('crypto');

var returnMsg = function(msg) {
    this.status = msg.status;
    this.msg = msg.msg;
}

router.get('/', function(req, res) {
    res.render('Login', {
        title: "Login"
    });
});

router.post('/', function(req, res) {
    var username = req.body['username'];
    var userPwd = req.body['password'];
    var rem = req.body['rem'];
    var md5 = crypto.createHash('md5');

    var newUser = new User({
        userName: username,
        userPassword: userPwd
    });

    //检查用户名是否存在
    User.getUserByUserName(username, function(err, results) {
        if (results == '') {
            sendMsg({
                status: false,msg: "用户名不存在"
            },res);
            return;
        }
        userPwd = md5.update(userPwd).digest('hex');
        if (results[0].userName != username || results[0].userPassword != userPwd) {
            sendMsg({
                status: false,msg: "用户名或密码错误"
            },res);
            return;
        } else {
            if (rem) {
                res.cookie('isLogin', username, {
                    maxAge: 60000
                });
            }
            sendMsg({
                status: true,msg: "登录成功"
            },res);
            res.locals.username = username;
            req.session.username = res.locals.username;
            console.log(req.session.username);
            res.redirect('/');
            return;
        }

    })
});

function sendMsg(rMsg,res) {
    var rMsg = new returnMsg({
        status: rMsg.status,
        msg: rMsg.msg
    });
    res.send(rMsg);
    console.log(rMsg.msg);
}

module.exports = router;
