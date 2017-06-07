'use strict';
var Promise = require("bluebird");
var getSqlConnection = require('../async_database');

class MatterService {
    
    createMatter (requestParams,next,callback){
        var data = requestParams.applicant_ids.concat(requestParams.defendant_ids);
        console.log(data);
        
        var qstring = "SET @matter_id =0; CALL create_matter(?, ?,  ?, ?, ?, ?,  @matter_id); select @matter_id;";
        
        return using(getSqlConnection(), function(conn) {
                 return conn.queryAsync( qstring);
            }).then(function(rows) {
                // connection already disposed here
                if ( (! rows.length) || rows.length <1) {
                    console.log("no data for " + query);
                    callback(false,[]);
                }
                console.log("\n\n\t\treturning data for create Matter\n\n");
                return callback(false,rows[rows.length-1][0]);
             })
             .catch (e => {
                return callback(true);
             });
    }

    getPromiseForMatterIdAndQuery(query, matter_id) {
        return Promise.using(getSqlConnection(), function(conn) {
                 return conn.queryAsync( "CALL "+ query+"("+matter_id+")");
            }).then(function(rows) {
                // connection already disposed here
                if ( (! rows.length) || rows.length <1) {
                    console.log("no data for " + query);
                    return [];
                }
                return rows[0];
            });
    }

    getMatterById (matter_id, callback){
        var promises = [];
        var queries = ["sp_get_matter_details_all","sp_get_applicant_for_matter",
        "sp_get_defendants_nonindi_for_matter","sp_get_defendants_indi_for_matter"];

        for (var i=0; i < queries.length; i++) {
          promises[i] = this.getPromiseForMatterIdAndQuery(queries[i],matter_id);
        }
        return Promise.join (...promises, function(mdeets,applicant,ndef,idef){
            return callback([mdeets,applicant,ndef,idef]);
        });
    }

    getAllMattersSummary (callback){
        var qstring = "CALL sp_getall_matter_summary_data()";
  
        return Promise.using(getSqlConnection(), function(conn) {
                 return conn.queryAsync( qstring);
            })
            .then(function(rows) {
                // connection already disposed here
                if ( (! rows.length) || rows.length <1) {
                    console.log("no data for " + query);
                    callback(false,[]);
                }
                console.log("\n\n\t\treturning data for summary of all matters (for table)\n\n");
                return callback(false,rows[0]);
            })
            .catch (e => {
                return callback(true);
            });
    }
}

module.exports = new MatterService();