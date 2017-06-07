 var mysql = require('mysql');
 var Promise = require("bluebird");
 Promise.promisifyAll(mysql);
 Promise.promisifyAll(require("mysql/lib/Connection").prototype);
 Promise.promisifyAll(require("mysql/lib/Pool").prototype);

var pool = mysql.createPool({
  host:  '127.0.0.1', //'localhost', //process.env.MYSQL_HOST,
  user:  'root', //process.env.MYSQL_USER,
  password: '',//process.env.MYSQL_PASS,
  database: 'c9', //process.env.MYSQL_DB,
  connectionLimit: 5 ,
  multipleStatements:true
//  supportBigNumbers: true
});

function getSqlConnection() {
    return pool.getConnectionAsync().disposer(function(connection) {
        //callback(null,connection);
        connection.release();
    });
}

module.exports = getSqlConnection;
/*
exports.executeCommand = function(sql ,params, callback) {
  // get a connection from the pool
  
  getSqlConnection(function(err, connection) {
    if(err) { console.log(err); callback(true); return; }
    // make the query
      connection.query(sql, params, function(err, results) {
      connection.release();
      if(err) { console.log(err); callback(true); return; }
      callback(false, results);
    });
  });
};*/