//TODO : Move this into database.js
exports.queryDBAsPromise = function (db,qstring,resolve,reject) {

    db.executeCommand(qstring,function(err,rows){
        console.log( "sqtring : " + qstring);
        if(err){
            console.log(err);
            reject(err);
        }
        if(rows.length < 1) {
            reject(new Error('no results'),null);
        }  
        resolve (rows[0]);
    });
}
