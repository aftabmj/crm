'use strict';
var db = require('../database');
var cq = require('../concurrent_queries');

class MatterService {
    
    createMatter (requestParams,next,callback){
        var data = requestParams.applicant_ids.concat(requestParams.defendant_ids);
        console.log(data);
        
        var qstring = "SET @matter_id =0; CALL create_matter(?, ?,  ?, ?, ?, ?,  @matter_id); select @matter_id;";

         db.executeCommand(qstring,data, function(err,rows){
            if(err){ 
                console.log(err);
                return next("Mysql error, check your query");
            } else {
                callback(rows[rows.length-1][0]);
            }
        });        
    }

    getMatterById (matter_id,next){
        var p0 = new Promise((resolve,reject) => {
                cq.queryDBAsPromise(db,
                    "CALL sp_get_matter_details_all("+matter_id+")",resolve,reject);
            });
        var p1 = new Promise((resolve,reject) => {
                cq.queryDBAsPromise(db,
                    "CALL sp_get_applicant_for_matter("+matter_id+")",resolve,reject);
            });
        var p2 = new Promise((resolve,reject) => {
                cq.queryDBAsPromise(db,
                    "CALL sp_get_defendants_nonindi_for_matter("+matter_id+")",resolve,reject);
            });
        var p3 = new Promise((resolve,reject) => {
                cq.queryDBAsPromise(db,
                    "CALL sp_get_defendants_indi_for_matter("+matter_id+")",resolve,reject);
            });
    
        return [p0,p1,p2,p3];
    }

    getAllMattersSummary (callback){
        var qstring = "CALL sp_getall_matter_summary_data()";
        db.executeCommand(qstring,null, function(err,rows){
            if(err){ 
                console.log(err);
                 callback(true);
            } else {
                console.log("\n\n\t\treturning data for summary of all matters (for table)\n\n");
                callback(false,rows[0]);
            }
        });
    }


}

module.exports = new MatterService();