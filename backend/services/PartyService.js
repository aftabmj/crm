'use strict';
var db = require('../database');
var cq = require('../concurrent_queries');

class PartyService {
    constructor() {
        this.candidateParties = [];
    }

    getCandidatesForMatterCreation(){
        return this.candidateParties;
    }

    getApplicantById (partyId,next,callback) {
         var qstring = "select lpty.rep_title,  nia.line1 as 'branch_line1', "+
        "nia.line2 as 'branch_line2',  nia.city as 'branch_city' , "+
        "nia.state as 'branch_state', nia.pincode as 'branch_pincode' , " +
        "lb.bank_name from party_type_non_individual ptn "+
        "inner join NonIndividualsAddresses nia on nia.address_id = ptn.non_individual_address_id "+
        "inner join lookup_banks lb on lb.main_office_address_id = ptn.main_office_address_id "+
        "inner join lookup_non_individual_party_types lpty on ptn.non_individual_type_id =  lpty.type_id "+
        " WHERE ptn.party_id = ? ;";
        var data = [partyId];
        
       // db.getRecords(qstring,data, callback);
         db.executeCommand(qstring,data, function (err,rows){
              if(err){
                console.log(err);
                return next("Mysql error, check your query");
              } else{
                  callback(rows);
              }
         });

    }

    createApplicant(data,next,callback) {
        var qstring ="SET @applicant_id=0;CALL sp_add_applicant(?, ?, ?, ?,@applicant_id);select @applicant_id; ";
        db.executeCommand(qstring,data, function (err,rows) {
            if(err){
                console.log(err);
                return next("Mysql error, check your query");
              } else{
                  callback(rows);
              }
        });
    }

//use c9;
//SET @defendant_id=0;CALL addIndividualDefendant('B',"rauq","m","Jalal","M. Jalal","father","home address","D3 3st ave", "this is line 2 suburb", "Chennai", " Tamil Nadu","600343", "Tech Director",true,"session id", @defendant_id);select @defendant_id;

    createIndependantDefendant(data,next,callback){

        console.log(" \n\n data " + JSON.stringify(data) + "\n\n");

        var qstring = "SET @defendant_id=0;CALL sp_add_indi_defendant(?, ?, ?, "+
                    "  ?, ?, ?,   ?, ?, ?,   ?, ?, ?,  ?, ?, ?,  @defendant_id);select @defendant_id;";
        db.executeCommand(qstring,data, function(err,rows){
            if(err){ 
                console.log(err);
                return next("Mysql error, check your query");
            } else {
                if(rows.length <1 )
                     return res.send("Bank Not found");
                else
                    callback(rows[rows.length-1][0]);
            }
        });
    }

    createNonIndependantDefendant(data,next,callback){

        console.log(" \n\n data " + JSON.stringify(data) + "\n\n");

        var qstring = "SET @ndef_id=0;CALL sp_add_nonindividual_defendant("+
                        "?, ?, ?, ?, ?,    ?, ?, ?, ?,@ndef_id);select @ndef_id;" ;
        db.executeCommand(qstring,data, function(err,rows){
            if(err){ 
                console.log(err);
                return next("Mysql error, check your query");
            } else {
                if(rows.length <1 )
                     return res.send("Bank Not found");
                else
                    callback(rows[rows.length-1][0]);
            }
        });
    }



    getCandidatesForMatter () {
        console.log( "here getCandidatesForMatter ");
        var qstring = '';
        var p1 = new Promise(
                (resolve,reject) => {
                    qstring = "CALL sp_get_nonindi_candidates()";
                    cq.queryDBAsPromise(db,qstring,resolve,reject);
                });
        var p2 = new Promise(
                (resolve,reject) => {
                    qstring = "CALL sp_get_indi_candidates()";
                    cq.queryDBAsPromise(db,qstring,resolve,reject);
                });
        
        return [p1,p2];
    }

}

module.exports = new PartyService();