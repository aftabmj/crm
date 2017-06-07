'use strict';
var db = require('../database');

//TODO : the callbacks in all cases do almost the same thing. this could be an common/reused piece of code.
class FacilityService {

    createFacility (data,next,callback){
         var qstring = "set @sanction_letter_no='' ; set @sanction_date='' ; set @availed_date =''; \
            set @account_no =''; set @amount = 0; set @purpose = '' ;" + 
            "set @loan_type_id = 0;set @matter_id = 0; \
            set @loan_id =0 ; " +
            "CALL sp_create_facility(?, ?, ?, ?,     ?, ?, ?,    ? , @loan_id); select @loan_id;"

         db.executeCommand(qstring,data, function(err,rows){
            if(err){ 
                console.log(err);
                return next("Mysql error, check your query");
            } else {
                callback(rows[rows.length-1][0]); // var loan_id = rows[rows.length-1][0]['@loan_id'];
            }
        }); 
    }

    createLoanRepaymentDetails (data,next,callback) {
        var qstring = "CALL sp_create_repayterms_for_loan(?, ?, ?,     ?, ?, ?);";

        db.executeCommand(qstring,data, function(err,rows){
            if(err){ 
                console.log(err);
                return next("Mysql error, check your query");
            } else {
                callback(rows);
            }
        });         

    }

}

module.exports = new FacilityService();