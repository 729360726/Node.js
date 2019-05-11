const mysql = require("mysql")
const {
    MYSQL_CONF
} = require('../conf/db')

const con = mysql.createConnection(MYSQL_CONF)

con.connect()

//执行sql函数

function exec(sql) {
    return new Promise((resolve, reject) => {
        con.query(sql, (err, result) => {
            if (err) {
                reject(err);
                return
            }
            resolve(result);
        })
    });
}

module.exports = {
    exec
}