
var matterService = require('../services/MatterService');

exports.createMatter = function(req, res, next) {
    var data = req.body;
    matterService.createMatter(data,next, function(err,rows) {
        if (err){
            return next("Mysql error, check your query");
        }
        if(rows.length < 1)
            return res.send("Anti-Matter creation problem");

        console.log("result " + rows["@matter_id"]);
        //res.send( JSON.stringify(rows));
        res.send(rows);
    });
};

exports.getMatterById = function(req,res,next){  
    if (!req.params.matter_id) {
        throw new Error("No Getter function specified when creating GET route [ m/:matter_id ].");
    }
    var matter_id = JSON.parse(req.params.matter_id);

    matterService.getMatterById(matter_id, function(rows) {
        if(rows.length < 1) {
            return res.send("Matter Not found");
        }
        console.log("controller rows " + rows);    
        // res.setHeader('Content-Type', 'application/json');
        // res.send(JSON.stringify(rows));
        res.send(rows);
    });          
};

exports.getAllMattersSummary = function(req,res,next) {    
    matterService.getAllMattersSummary(function(err,rows){
        if (err){
            return next("Mysql error, check your query");
        }
        if(rows.length < 1)
            return res.send("No Matter was found");
        //res.setHeader('Content-Type', 'application/json');
        //res.send(JSON.stringify(rows));
        res.send(rows);
    });
};