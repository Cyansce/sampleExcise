var mysql = require('mysql');
var DB_NAME = "nodejs";

var pool = mysql.createPool({
    host: 'localhost',
    user: 'cys',
    password: '123456'
});

pool.on('connection', function(connection) {
    connection.query('set session auto_increment_increment=1');
});

var User = function(user) {
    this.userName = user.userName;
    this.userPassword = user.userPassword;
}

module.exports = User;

//打开连接
pool.getConnection(function(err, connection) {
    var useDbSql = "use " + DB_NAME;
    connection.query(useDbSql, function(err) {
        if (err) {
            console.log('[Use Error]-' + err.message);
            return;
        }
        console.log('[Use Success]');
    });
    connection.release();
});

//新增用户
User.prototype.save = function save(callback) {
    pool.getConnection(function(err, connection) {
        var user = {
            userName: this.userName,
            userPassword: this.userPassword
        };

        var insertUserSql = "insert into userInfo(userName,userPassword) values(?,?)";
        connection.query(insertUserSql, [user.userName, user.userPassword], function(err, result) {
            if (err) {
                console.log("[insertUser Error] - " + err.message);
                return;
            }

            connection.release();
            console.log("[invoked save]");
            callback(err, result);
        })
    });

}

//根据用户名查找用户
User.getUserByUserName = function getUserByUserName(userName, callback) {
    pool.getConnection(function(err, connection) {
        var getUserByUserNameSql = "select * from userInfo where userName=?";

        connection.query(getUserByUserNameSql, [userName], function(err, result) {
            if (err) {
                console.log('[getUserByUserName Error - ]' + err.message);
                return;
            }
            connection.release();

            console.log('[invoked getUserByUserName]');

            callback(err, result);
        })

    });

};

//根据用户名查找用户个数
User.getUserNumByUserName = function getUserNumByUserName(userName, callback) {
    pool.getConnection(function(err, connection) {
        var getUserNumByUserNameSql = "select count(1) from userInfo where userName = ?";

        connection.query(getUserNumByUserNameSql, [userName], function(err, result) {
            if (err) {
                console.log('[getUserNumByUserNameSql Error] - ' + err.message);
                return;
            }
            connection.release();

            console.log('[invoked getUserNumByUserNameSql]');

            callback(err, result);
        });
    });
};

//修改用户密码
User.updateUserPasswordById = function(id, password, callback) {
    pool.getConnection(function(err, connection) {
        var updateUserPasswordByIdSql = "update userInfo set userPassword = ? where id = ?";

        connection.query(updateUserPasswordByIdSql, [password, id], function(err, result) {
            if (err) {
                console.log('[updateUserPasswordById Error] - ' + err.message);
                return;
            }
            connection.release();
            console.log('[invoked updateUserPasswordById]');

            callback(err, result);
        });
    });
};
