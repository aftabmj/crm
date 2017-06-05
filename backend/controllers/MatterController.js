

var matterService = require('../services/MatterService');
var fake_session_id = "29May2017";
exports.createMatter = function(req, res, next) {

    var session_id =fake_session_id; //req.session.id;  

    var data = req.body;
    matterService.createMatter(data,next, function(rows) {
        if(rows.length < 1)
            return res.send("Anti-Matter creation problem");

        console.log("result " + rows["@matter_id"]);
        res.send( JSON.stringify(rows));
    });
};


exports.getMatterById = function(req,res,next){
  
    if (!req.params.matter_id) {
        throw new Error("No Getter function specified when creating GET route [ m/:matter_id ].");
    }
    var matter_id = JSON.parse(req.params.matter_id);

    var arrayOfPromises = matterService.getMatterById(matter_id,next );

    Promise.all(arrayOfPromises)
            .then((rows) => {               // resolve , reject .. should this have the node callback error first 
                                            //params ? 
                if(rows.length < 1) {
                    return res.send("Matter Not found");
                }
                res.setHeader('Content-Type', 'application/json');
                res.send(JSON.stringify(rows));
             })
            .catch((e) => { 
                console.log(e);
                return next(e);
            }); 


    
    /*,next,function(err,rows){
            console.log("\n\n\t\t\t Going to send Rows back to client "+ rows.length+ "\n\n\n" );
            console.log("\n\n\t\t\t Going to send Rows back to client "+ rows.length+ "\n\n\n" );

            if(rows.length < 1) {
                return res.send("Matter Not found");

            }
            res.setHeader('Content-Type', 'application/json');
            res.send(JSON.stringify(rows));
        });*/
};

exports.getAllMattersSummary = function(req,res,next) {
    
    matterService.getAllMattersSummary(function(err,rows){
        if (err){
            return next("Mysql error, check your query");
        }
        if(rows.length < 1)
            return res.send("No Matter was found");

        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify(rows));
    });

};