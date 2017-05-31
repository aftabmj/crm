
var facilityService = require('../services/FacilityService');

exports.createFacility = function(req, res, next) {

    var obj = req.body;
    var data = [
            obj.sanctionLetterNo,
            new Date(obj.sanctionedDate),new Date(obj.availedDate),
            obj.accountNo,
            
            obj.loanAmount,    obj.loanPurpose,
            obj.facilityTypeId, obj.matter_id
    ];
    facilityService.createFacility(data,next, function(rows) {
        if(rows.length < 1)
            return res.send("Facility creation problem");

        // better method is obj["facilityTypeId"] !== 4   (cash credit)
        if (typeof obj["installmentPeriod"] === "undefined" || 
                    !obj["installmentPeriod"] ) {
            res.sendStatus(201);
            return;
        }
    
        var loan_id = rows['@loan_id'];
        data = [
            loan_id,
            obj.numInstallments,  obj.installmentPeriod,
            obj.installmentAmount, obj.moratoriumMonths,
            new Date(obj.startingFrom)
        ];
        facilityService.createLoanRepaymentDetails(data,next, function(rows){
            console.log("LoanRepaymentDetails create result rrows "+ JSON.stringify(rows));
            if(rows.length < 1)
                return res.send("LoanRepaymentDetails creation problem");
            
            res.sendStatus(201);
            return;
        });
    });//createFacility

};