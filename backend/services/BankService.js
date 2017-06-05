'use strict';
var db = require('../database');

class BankService {

    // have a local variable to store the banks and branches after the call.
    constructor(){
        //console.log()
       // this.banks = new Map();
    }


    getBranchesForBank(bank_id,callback) {

        var qstring = "select b.branch_name, a.* "+
                        "from BankAddresses a inner join Branches b "+
                        "on b.address_id = a.address_id " +
                        "WHERE bank_id = ?";
        //var branches = this.banks.get(bank_id);//.branches;
        //if (!branches || "undefined" !== typeof(branches)) {
           // console.log("using the cached version of bank branches. saved time : " + this.banks[bank_id].savedTime );
        //    callback(branches);
        //} else {
            db.executeCommand(qstring,[bank_id],function(err,rows){
                if(err){
                    console.log(err);
                } else {
                    //if (! this.banks || "undefined" !== typeof(branches) ){
                    //    this.banks = new Map();
                    //}
                  //  this.banks.set (bank_id /*.branches */, rows);
                    //this.banks[bank_id].savedTime = Date.now;
                    callback(rows);
                }
            });
        //}
    }
}


module.exports = new BankService();