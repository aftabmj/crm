
var fake_session_id = "17May2017";

var express  = require('express'),
    excors = require('express-cors'),
    path     = require('path'),
    bodyParser = require('body-parser'),
    app = express();
  //  session = require('express-session');
   // expressValidator = require('express-validator');
  
  /*  
app.use(session({
    secret :'aftabisawesome',
    resave : true,
    saveUninitialized:true
}));
*/

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({
  extended: true
}));

//app.use(expressValidator());

/*MySql connection*/
var connection  = require('express-myconnection'),
    mysql = require('mysql');

app.use(
    connection(mysql,{
        host     : 'localhost',
        user     : 'root',
        password : '',
        database : 'c9',
        debug    : false, //set true if you wanna see debug logger
        multipleStatements: true    //this was needed for getting back the matter id after it was just created
    },'request')

);
app.get('/',function(req,res){
    res.send('Welcome');
});
//var sessionStore  = new mySqlStore({},);

//RESTful route
var router = express.Router();

//now we need to apply our router here
app.use('/api', router);


/*------------------------------------------------------
*  This is router middleware,invoked everytime
*  we hit url /api and anything after /api
*  like /api/user , /api/user/7
*  we can use this for doing validation,authetication
*  for every route started with /api
--------------------------------------------------------*/

// CORS !! 
router.use(excors({
    allowedOrigins: ['http://frontend-mjcoder.c9users.io:8080','http://frontend-mjcoder.c9users.io'] 
    //, maxAge : 2*60
}));

//////////////////////////////////////////////////////
/*
// Authentication and Authorization Middleware
var auth = function(req, res, next) {
  if (req.session && req.session.user === "mj" && req.session.admin)
    return next();
  else
    return res.sendStatus(401);
};
// Login endpoint
app.get('/login', function (req, res) {
  if (!req.query.username || !req.query.password) {
    res.send('login failed');
  } else if(req.query.username === "mj" || req.query.password === "mjpass") {
    req.session.user = "mj";
    req.session.admin = true;
    req.session.id = req.session.user + '_' + (new Date()).toISOString();
    req.session.defendant_ids =[];
    req.session.applicant_ids =[];
    res.send("login success!");
  } 
});
 
// Logout endpoint
app.get('/logout', function (req, res) {
  req.session.destroy();
  res.send("logout success!");
});
 
// Get content endpoint
app.get('/api', auth, function (req, res) {
    res.send("You can only see this after you've logged in.");
 
});*/
 
 
 

////////////////// 1111 ///////////////////////////////

var bank_branches = router.route('/branch_address');
//app.use('/branch_address',auth,router);  //auth protect the route

//show the CRUD interface | GET
bank_branches.get(function(req,res,next){
     
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
});

//////////////////////////222222//////////////////////////////////////////////


//post data to DB | POST
bank_branches.post(function(req,res,next){

    
    //get data from the request
    var data = [
        req.body.bank_id,
        req.body.branch_addr_id,
        req.body.rep_title,
        fake_session_id //req.session.id // session_id
     ];
    
    //inserting into mysql
    req.getConnection(function (err, conn){
        if (err) return next("Cannot Connect to Database.");
        
        var query = conn.query("SET @applicant_id=0;CALL sp_add_applicant(?, ?, ?, ?,@applicant_id);select @applicant_id; ",data,
                        function(err, rows){
                           if(err){ 
                                console.log(err);
                                return next("Mysql error, check your query");
                           }
                           var applicant_id ='';
                          //  if(req.body.is_main == 1 ) {
                            
                        //        req.session.applicant_ids.push(rows[rows.length-1][0]['@applicant_id']);
                         //   }
                         // res.sendStatus(201);
                          console.log("applicant_id  " + rows[rows.length-1][0]['@applicant_id']);
                          res.setHeader('Content-Type', 'text/plain');
                          res.status(201);
                          res.send( JSON.stringify(rows[rows.length-1][0]));
                         
                        });
     });
    
});


///////////////////////////3333333//////////////////////////////////////

//get all branches for THIS bank
var bank_branch = router.route('/branch_address/:bank_id');

//get data to update
bank_branch.get(function(req,res,next){

    var bank_id = req.params.bank_id;
    req.getConnection(function(err,conn){
        if (err) return next("Cannot Connect");
        var qstring = "select b.branch_name, a.* "+
                        "from BankAddresses a inner join Branches b "+
                        "on b.address_id = a.address_id " +
                        "WHERE bank_id = ?";
        var query = conn.query(qstring,[bank_id],function(err,rows){
 
            if(err){
                console.log(err);
                return next("Mysql error, check your query");
            }
            if(rows.length < 1)
                return res.send("Bank Not found");

            res.setHeader('Content-Type', 'application/json');
            res.send(JSON.stringify(rows));

        });
    });
});
///////////////////////////////////////////////////////////////////

/////////////////////////4444444////////////////////////////////////////

//get Applicant details for party-id
var party = router.route('/applicant_details/:party_id');

//get data to update    
party.get(function(req,res,next){
    console.log( "in applicant_details/:party_id ");
    var party_id = JSON.parse( req.params.party_id);
    req.getConnection(function(err,conn){
        if (err) return next("Cannot Connect");
        var qstring = "select lpty.rep_title,  nia.line1 as 'branch_line1', "+
        "nia.line2 as 'branch_line2',  nia.city as 'branch_city' , "+
        "nia.state as 'branch_state', nia.pincode as 'branch_pincode' , " +
        "lb.bank_name from party_type_non_individual ptn "+
        "inner join NonIndividualsAddresses nia on nia.address_id = ptn.non_individual_address_id "+
        "inner join lookup_banks lb on lb.main_office_address_id = ptn.main_office_address_id "+
        "inner join lookup_non_individual_party_types lpty on ptn.non_individual_type_id =  lpty.type_id "+
        " WHERE ptn.party_id = ? ;";
        
        var query = conn.query(qstring,[party_id],function(err,rows){
 
            if(err){
                console.log(err);
                return next("Mysql error, check your query");
            }
            if(rows.length < 1)
                return res.send("Bank Not found");

            res.setHeader('Content-Type', 'application/json');
            res.send(JSON.stringify(rows));

        });
    });
});



////////////////////////////5555555555555//////////////////////////////////////
//   addIndividualDefendant('B','Aftab','Mohamed' , 'Jalal', 'Jennifer',
//                      'Jalaludeen','Home Address','A-3 First Cross St',
//                  'KurinjiNagar Ramapuram','Chennai','Tamil Nadu','600089');
//financial_role , first_name, middle_name,last_name
//,spouse_name , father_name,addr_name, line1, line2, city ,state, pincode)

var addIndividualDefendant = router.route('/defendant_details/');
//post data to DB | POST
addIndividualDefendant.post(function(req,res,next){
    // TODO:  check for SQL injection and also special characters...
    
    //get data from the request
    //console.log(req.body);
    var obj = req.body;
    var data = [
        obj.financial_role,
        obj.first_name, obj.middle_name, obj.last_name,
        obj.relative_name,obj.relative_type,
        obj.address_name,  obj.line1, 
        obj.line2 +' '+ obj.suburb,       // adding some concat logic here 
        obj.city, obj.state, obj.pincode,
        obj.occupation,
        1, //obj.is_main,           // is_main
        fake_session_id  //req.session.id
      ];
    
    //inserting into mysql
    req.getConnection(function (err, conn){
        if (err) return next("Cannot Connect to Database.");
        var qString = "SET @defendant_id=0;CALL addIndividualDefendant(?, ?, ?,"+
                        "?, ?, ?,   ?, ?, ?,   ?, ?, ?,  ?, ?, ?, @defendant_id);select @defendant_id;";
        var query = conn.query(qString,data,
                        function(err, rows){
                           if(err){ 
                                console.log(err);
                                return next("Mysql error, check your query");
                           }
                            var defendant_id = rows[rows.length-1][0]['@defendant_id'];
                           // if(obj.is_main == 1 ) {
                           // req.session.defendant_ids.push(rows[rows.length-1][0]['@defendant_id']);
                        //    }
                        
                          console.log("def id  " + defendant_id);
                          res.status(201);
                          res.send(JSON.stringify(rows[rows.length-1][0]));
                         // res.sendStatus(200);
                        });
     });
});

function queryDBAsPromise(req,qstring,resolve,reject) {

    req.getConnection(function(err,conn){
        if (err) 
            return reject("Cannot Connect");
      //  var qstring = "CALL sp_get_" +type+"_candidates()";
        console.log( "sqtring : " + qstring);
        
        var query = conn.query(qstring,function(err,rows){
 
            if(err){
                console.log(err);
                reject(err);
                //return next("Mysql error, check your query");
            }
            if(rows.length < 1) {
                reject(new Error('no results'),null);
                //console.log("no data !!");
                //return res.send("Bank Not found");
            }
            
            resolve (rows[0]);
        });
    });
}


var candidates = router.route('/getCandidatesForMatter/');

candidates.get(function(req,res,next){
    console.log( "here getCandidatesForMatter ");
    var qstring = '';
    var p1 = new Promise(
            (resolve,reject) => {
                qstring = "CALL sp_get_nonindi_candidates()";
                queryDBAsPromise(req,qstring,resolve,reject);
            });
    var p2 = new Promise(
            (resolve,reject) => {
                 qstring = "CALL sp_get_indi_candidates()";
                queryDBAsPromise(req,qstring,resolve,reject);
            });
    
    Promise.all([p1,p2])
        .then((results) => {
            console.log(results);
            res.setHeader('Content-Type', 'text/plain');
            res.send(results);
        })
        .catch((e) => { console.log(e)}); //send error ?
});


//1. Before objects are associated with the session (matter_id not created yet) :
        //get_last_created_objects(['applicant', 'defendant'])
    //NO  -> get_all_objects_not_associated_with_matter
    //    -- select * from Party where party_id not in (select * in party_matter )


//2. review_session_object  -> no use review_matter_objects (once matter id is created)
        //gets applicant(s), defendant(s) who are associated with this session_id

        
////////////////////////66666666//////////////////////////////////////////
var createMatter = router.route('/createMatter/');

createMatter.post(function(req, res, next) {

    var session_id =fake_session_id; //req.session.id;    
 
     var data = req.body.applicant_ids.concat(req.body.defendant_ids);
   
     console.log(data);
     
    var qString = "SET @matter_id =0; CALL create_matter(?, ?,  ?, ?, ?, ?,  @matter_id); select @matter_id;";
    
    req.getConnection(function (err, conn){
        if (err) return next("Cannot Connect to Database.");
        
        var query = conn.query(qString,data,
                        function(err, rows){
                           if(err){ 
                                console.log(err);
                                return next("Mysql error, check your query");
                           }
                           
                          if(rows.length < 1)
                                return res.send("matter creation problem");
                                
                       // req.session.matter_id = rows[rows.length-1][0]['@matter_id'];
                    //    req.session.defendant_id = defendant_id;
                      //  req.session.applicant_id = applicant_id;
                        
                        //req.session.destroy();
                        
                        console.log("result " + rows[rows.length-1][0]["@matter_id"]);

                        res.send( JSON.stringify(rows[rows.length-1][0]));

                });//conn.query
                        
        }); //getConnection
}); //post


///
// after creating matter , the aurelia client , receives the matter_id and main defendant id.
// and then redirects to createFacility by posting this data.
// create facility post has to have thsi information in the req.body

////////////////////////7777777777//////////////////////////////////////////
var createFacility = router.route('/create_facility');
createFacility.post(function(req,res,next){
    //get data from the request
    
    //console.log("borrower : " + sanctioned_to_party_id);
    
    var obj = req.body;
    
    var data = [
            obj.sanctionLetterNo,
            obj.sanctionedDate,
            obj.availedDate,
            obj.accountNo,
            
            obj.loanAmount,
            obj.loanPurpose,
            obj.facilityTypeId,
            
            obj.matter_id
    ];

    //inserting into mysql
    req.getConnection(function (err, conn){
        if (err) return next("Cannot Connect to Database.");
        
        var qString = "set @sanction_letter_no='' ; set @sanction_date='' ; set @availed_date =''; \
            set @account_no =''; set @amount = 0; set @purpose = '' ;" + 
            "set @loan_type_id = 0;set @matter_id = 0; \
            set @loan_id =0 ; " +
            "CALL sp_create_facility(?, ?, ?, ?,     ?, ?, ?,    ? , @loan_id); select @loan_id;"
    
        var query = conn.query(qString,data,
            function(err, rows){
                if(err){ console.log(err);
                    return next("Mysql error, check your query");}
                           
                if(rows.length < 1) 
                    return res.send("facility creation problem");
                
                if (typeof obj["installmentPeriod"] === "undefined" || 
                        !obj["installmentPeriod"] ) 
                {
                    res.sendStatus(201);
                    return;
                }  
                        
                //console.log("load id : " + rows[rows.length-1][0]['@loan_id']);
                var loan_id = rows[rows.length-1][0]['@loan_id'];
                
                /// Part Deux ////////////////////                  /////////////
                var qString = "CALL sp_create_repayterms_for_loan(?, ?, ?,     ?, ?, ?);";
                                   
                var data = [
                    loan_id,
                    obj.numInstallments,
                    obj.installmentPeriod,
                    obj.installmentAmount,
                    obj.moratoriumMonths,
                    obj.startingFrom
                ];
    
                console.log("calling sp_create_repayterms_for_loan" + JSON.stringify(data));
                
                conn.query(qString,data,
                    function(err, rows){
                        if(err){ 
                            console.log(err);
                            return next("Mysql error, check your query");
                        }
                       
                        if(rows.length < 1)
                            return res.send("facility creation problem");

                        console.log("done");
                        res.sendStatus(201);
                });
        }); // conn.query function

    });//req.getConnection
    
});

////////////////////////8888888888888888//////////////////////////////////////////

// this is for the cases listing table
var def_matter = router.route('/getPartiesAndMatterData/');

def_matter.get(function(req,res,next){

    req.getConnection(function(err,conn){
        if (err) 
            return next("Cannot Connect");
            
        var qstring = "CALL sp_getall_matter_summary_data()";
        console.log( "sqtring : " + qstring);
        
        var query = conn.query(qstring,function(err,rows){
 
            if(err){
                console.log(err);
                return next("Mysql error, check your query");
            }
            if(rows.length < 1) {
                //return new Error('no results'),null;
                //console.log("no data !!");
                return res.send("Bank Not found");
            }
            console.log("sending results" + JSON.stringify(rows[0]));
            res.send( JSON.stringify(rows[0]));
        });
    });
});




var matter_details = router.route('/getMatterDetails/:id');

matter_details.get(function(req,res,next){

    var matter_id = req.params.id;
    
    //sp_get_matter_details_all
    
    // get applicant details
    var p0 = new Promise((resolve,reject) => {
                queryDBAsPromise(req,"CALL sp_get_matter_details_all("+matter_id+")",resolve,reject);
            });

    var p1 = new Promise((resolve,reject) => {
                queryDBAsPromise(req,"CALL sp_get_applicant_for_matter("+matter_id+")",resolve,reject);
            });
    var p2 = new Promise((resolve,reject) => {
                queryDBAsPromise(req,"CALL sp_get_defendants_nonindi_for_matter("+matter_id+")",resolve,reject);
            });
    var p3 = new Promise((resolve,reject) => {
                queryDBAsPromise(req,"CALL sp_get_defendants_indi_for_matter("+matter_id+")",resolve,reject);
            });
    
    Promise.all([p0,p1,p2,p3])
        .then((results) => {
            console.log(results);
            res.setHeader('Content-Type', 'text/plain');
            res.send(results);
        })
        .catch((e) => { console.log(e)}); //send error ?
        
});

//////////////////////////////////////////////////////////////////

function doAuthStuff() {
    var readline = require('readline');
    var google = require('googleapis');
    var OAuth2Client = google.auth.OAuth2;
    var CLIENT_ID = '659553487255-u17insantei4hi3l8ifnhjbrcmb62a1o.apps.googleusercontent.com';
    var CLIENT_SECRET = 'WL53NLcCqS9LEdy0snfLtrJ-';
    var REDIRECT_URL = 'https://express-webserver-mjcoder.c9users.io:8080/api/oauth2callback';

    var oauth2Client = new OAuth2Client(CLIENT_ID, CLIENT_SECRET, REDIRECT_URL);
    
    var rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
}
function getAccessToken (oauth2Client, callback) {
  // generate consent page url
  var url = oauth2Client.generateAuthUrl({
    access_type: 'offline', // will return a refresh token
    scope: ['https://www.googleapis.com/auth/documents',
          'https://www.googleapis.com/auth/drive' // can be a space-delimited string or an array of scopes
          ]
  });
}

/*
var oa_matter = router.route('/generateOA/:id');

oa_matter.get(function(req,res,next){

    var matter_id = req.params.id;
    
});

*/


///////////////////////////////////////////////////////////////////

// similar to 2222 ------------------------------------------

//post data to DB | POST
var addNonIndividualDefendant = router.route('/ni_defendant_details/');
addNonIndividualDefendant.post(function(req,res,next){

    //get data from the request
    var data = [
        req.body.financial_role
        ,req.body.rep_name
        , req.body.address_name
        ,req.body.line1
        ,req.body.line2
        
        ,req.body.city
        ,'Tamil Nadu'
        ,req.body.pincode
        ,req.body.rep_type_id
     ];
    
    //inserting into mysql
    req.getConnection(function (err, conn){
        if (err) return next("Cannot Connect to Database.");
        
        var qstring = "SET @ndef_id=0;CALL sp_add_nonindividual_defendant("+
                        "?, ?, ?, ?, ?,    ?, ?, ?, ?,@ndef_id);select @ndef_id;" ;
        var query = conn.query(qstring,data,
                        function(err, rows){
                           if(err){ 
                                console.log(err);
                                return next("Mysql error, check your query");
                           }
                          console.log("ndef_id  " + rows[rows.length-1][0]['@ndef_id']);
                          res.setHeader('Content-Type', 'text/plain');
                          res.status(201);
                          res.send( JSON.stringify(rows[rows.length-1][0]));
                         
                        });
     });
    
});




//start Server
var server = app.listen(8080,function(){
   console.log("Listening to port %s",server.address().port);
});



////////////////////////////////////////////////////////////////////
    //validation
    /*req.assert('name','Name is required').notEmpty();
    req.assert('email','A valid email is required').isEmail();
    req.assert('password','Enter a password 6 - 20').len(6,20);

    var errors = req.validationErrors();
    if(errors){
        res.status(422).json(errors);
        return;
    }*/
    
