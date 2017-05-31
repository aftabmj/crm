

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

    matterService.getMatterById(matter_id,next,function(rows){
            if(rows.length < 1)
                return res.send("Matter Not found");

            res.setHeader('Content-Type', 'application/json');
            res.send(JSON.stringify(rows));
        });
};

exports.getAllMattersSummary = function(req,res,next) {
    
    matterService.getAllMattersSummary(next,function(rows){
        if(rows.length < 1)
            return res.send("No Matter was found");

        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify(rows));
    });

};