
var PartyService = require('../services/PartyService');

//require model/Branch
var fake_session_id = "29May2017";
exports.createApplicant = function(req,res,next){
    var data = [
         req.body.bank_id,   req.body.branch_addr_id,
         req.body.rep_title, fake_session_id //req.session.id // session_id
     ];

    PartyService.createApplicant(data, next, function(err, rows){
        res.setHeader('Content-Type', 'text/plain');
        res.status(201);

        //TODO : investigate - unlike the older implementation, 
        // the 'mysql' library (pool) connection does not
        //seem to print out output rows from multiStatement requests
        console.log("Rows : ----------" + rows);
        res.send( JSON.stringify(rows));                    
    });  
};
////////////////////////////////////////////////////////////////
exports.getApplicantById = function(req,res,next){
    console.log( "in applicant/:party_id ");
    
    if (!req.params.party_id) {
        throw new Error("No Getter function specified when creating GET route [ applicant/:party_id ].");
    }
    var party_id = JSON.parse( req.params.party_id);

    PartyService.getApplicantById(party_id,next,function(rows){
            if(rows.length < 1)
                return res.send("Bank Not found");

            res.setHeader('Content-Type', 'application/json');
            res.send(JSON.stringify(rows));
        });
};
/////////////////////////////////////////////////////////////////////////////
exports.createIndependantDefendant =  function(req,res,next){
    // TODO:  check for SQL injection and also special characters...
    //console.log(req.body);
    var obj = req.body;

    var data = [
        obj.financial_role, obj.first_name, obj.middle_name, obj.last_name,
        obj.relative_name,obj.relative_type,
        obj.address_name,  obj.line1,  obj.line2 +' '+ obj.suburb, // adding some concat logic here 
        obj.city, obj.state, obj.pincode,  obj.occupation,
        1, fake_session_id  //obj.is_main,   //req.session.id
      ];

    PartyService.createIndependantDefendant(data,next,function(rows){
            var defendant_id = rows; //rows[rows.length-1][0]['@defendant_id'];
            console.log("def id  " + defendant_id);
            res.status(201);
            res.send(JSON.stringify(rows));
     });
     
};

exports.createNonIndependantDefendant =  function(req,res,next){
    // TODO:  check for SQL injection and also special characters...
    var obj = req.body;

    var data = [
         req.body.financial_role   ,req.body.rep_name   ,req.body.address_name
        ,req.body.line1   ,req.body.line2
        ,req.body.city    ,'Tamil Nadu'    ,req.body.pincode
        ,req.body.rep_type_id
     ];

    PartyService.createNonIndependantDefendant(data,next,function(rows){
            res.setHeader('Content-Type', 'text/plain');
            res.status(201);
            res.send(JSON.stringify(rows));
     });
};


exports.getCandidatesForMatter = function (req,res,next){
       var arrayOfPromises = PartyService.getCandidatesForMatter ();
           
           Promise.all(arrayOfPromises)
            .then((results) => {
                console.log("here are the results : " + results);
                res.setHeader('Content-Type', 'text/plain');
                res.send(results);
            })
            .catch((e) => { 
                console.log(e); 
                next("Caught Exception in GetCandidatesForMatter");
            });
}
