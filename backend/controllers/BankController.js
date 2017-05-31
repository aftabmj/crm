

var bankService = require('../services/BankService');

//get all branches for THIS bank
exports.getBranchesForBank = function(req,res,next){

    var bank_id = req.params.bank_id;
      
    bankService.getBranchesForBank(bank_id,function(rows){
        if(rows.length < 1)
            return res.send("Bank Not found");

        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify(rows));

    });

}



/*exports.getAllBranches = function(req,res,next){
     
    req.getConnection(function(err,conn){
        if (err) return next("Cannot Connect");
        var qstring = "select  b.bank_id , b.branch_name , a.* "+
                        "from BankAddresses a inner join Branches b "+
                        "on b.address_id = a.address_id ";

        var query = conn.query(qstring,function(err,rows){
            if(err){
                console.log(err);
                return next("Mysql error, check your query");
            }
            res.setHeader('Content-Type', 'application/json');
            
            res.send(JSON.stringify(rows));
         });
    });
}*/