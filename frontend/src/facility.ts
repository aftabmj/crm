export class Facility {
 
    public matter_id:number;
    sanctionLetterNo:string;
    sanctionedDate:Date;
    availedDate:Date;
    accountNo:string;
    
    public facilityTypeId:number;
    loanAmount:number;
    loanPurpose:string;
    
    //repayment terms
    numInstallments:number;
    installmentPeriod:string;
    installmentAmount:number;
    moratoriumMonths:number;
    startingFrom:Date;
    
    public resetForm(): void{
        this.sanctionLetterNo = this.sanctionedDate = this.availedDate = this.accountNo = undefined;
        this.facilityTypeId = this.loanAmount = this.loanPurpose = undefined;
        
        this.numInstallments = undefined;
        this.installmentPeriod = undefined;
        this.installmentAmount = undefined;
        this.moratoriumMonths = undefined;
        this.startingFrom = undefined;
    }
    
    toString() :string {
            return "matter:"+this.matter_id + "< \n" + 
            this.sanctionLetterNo + " "+
            this.sanctionedDate + " " +
            this.availedDate + " " +
            this.accountNo + " \n" +
            
            this.facilityTypeId + " " +
            this.loanAmount +  " " +
            this.loanPurpose + " \n" +
            
            //repayment terms
            this.numInstallments + " " +
            this.installmentPeriod + " " +
            this.installmentAmount + " \n" +

            this.moratoriumMonths + " " +
            this.startingFrom;
    }
}