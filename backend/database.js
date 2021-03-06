 var mysql = require('mysql');

var pool = mysql.createPool({
  host:  'localhost', //process.env.MYSQL_HOST,
  user:  'root', //process.env.MYSQL_USER,
  password: '',//process.env.MYSQL_PASS,
  database: 'c9', //process.env.MYSQL_DB,
  connectionLimit: 4,
  multipleStatements:true
//  supportBigNumbers: true
});

// rename from getRecords to execute DB query
exports.executeDBCommand = function(sql ,params, callback) {
  // get a connection from the pool
  pool.getConnection(function(err, connection) {
    if(err) { console.log(err); callback(true); return; }
    // make the query
      connection.query(sql, params, function(err, results) {
      connection.release();
      if(err) { console.log(err); callback(true); return; }
      callback(false, results);
    });
  });
};