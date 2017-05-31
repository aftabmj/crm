import {customElement, bindable} from 'aurelia-framework';
import {noView} from 'aurelia-framework';

@customElement('individualdetails')
@noView
export class IndividualDetails {
    
         id:number;
         @bindable public isChosenForMatter:boolean;
         @bindable saluation:string;
         @bindable first_name:string;
         @bindable middle_name:string;
         @bindable last_name:string;
         @bindable relative_name:string;
         @bindable public relative_type:string;
         @bindable public address_name:string;
         @bindable line1:string;
         @bindable line2:string;
         @bindable city:string;
         @bindable suburb:string;
         @bindable public state:string;
         @bindable pincode:string;
         @bindable public financial_role:string;
         @bindable occupation:string;
    
    constructor(
             id:number, sa:string, f:string,m:string,l:string,rn:string,rt:string,
             an:string,l1:string, l2:string, c:string, s:string,
             st:string, p:string, r:string, o:string ) {

            this.id= id;
            this.saluation=sa;
            this.first_name = f;
            this.middle_name=m;
            this.last_name=l;
            this.relative_name=rn;
            this.relative_type=rt;
            this.address_name=an;
            this.line1 = l1; this.line2 = l2;
            this.city= c; this.suburb= s;
            this.state=st;
            this.pincode= p;
            this.financial_role=r;
            this.occupation=o;
            this.isChosenForMatter =false;
        } 
    
    public resetDetails (){
        //this.id=0;----------------------> not sure about this
        this.saluation ="0";
        this.first_name ="";
        this.middle_name="";
        this.last_name="";
        this.relative_name="";
        this.relative_type="father";
        this.address_name="";
        this.line1 = this.line2 = "";
        this.city="0"; this.suburb="";
        this.state="";
        this.pincode="";
        this.financial_role="";
        this.occupation ="";
    }
    
    
    public toString():string {
      
      return this.id + '\n' +
          this.isChosenForMatter + '\n' +
          this.saluation + '\n'+
          this.first_name + ' ' +  this.middle_name + ' ' + this.last_name + '\n' +
          this.relative_name + ' ' +  this.relative_type + '\n' +
          this.address_name + '\n' +
          this.line1 + '\n' +
          this.line2 + '\n' +
          this.suburb + '\n' +
          this.city + ' ' + this.pincode + '\n' +
          this.state + '\n' +
          this.financial_role + '\n' +
          this.occupation;
     }
        
    
}