
export class Matter {

    public id:number;
    public details:any;
    public applicants:any[];
    public defendants:any[];

    constructor(mId:number,mDetails:any,applicants:any[],defendants:any[]){
      this.id = mId;
      this.details = mDetails;
      this.applicants = applicants;
      this.defendants = defendants;
    }

}
