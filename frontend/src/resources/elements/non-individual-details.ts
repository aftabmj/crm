import {customElement, bindable} from 'aurelia-framework';
import {noView} from 'aurelia-framework';

@customElement('nonindividualdetails')
@noView
export class NonIndividualDetails {
//  value;

//  valueChanged(newValue, oldValue) {

//  }
            id:number;
         @bindable public isChosenForMatter:boolean;
         @bindable bank_name:string;
         @bindable group_type:string;
         @bindable rep_name:string;
         @bindable rep_title:string;
         @bindable public rep_type_id:number;
         @bindable public address_name:string;
         @bindable line1:string;
         @bindable line2:string;
         @bindable city:string;
         @bindable suburb:string;
         @bindable public state:string;
         @bindable pincode:string;
         @bindable public financial_role:string;
         

         constructor(
             id:number, b:string, f:string,t:string,a:string,
             l1:string, l2:string, c:string, s:string,
             st:string, p:string, r:string ) {
                this.id= id;
             this.bank_name = b;
             this.rep_name=f ;
//             this.rep_middle_name= m;
//             this.rep_last_name= l;
             this.rep_title= t;
             this.address_name=a ;
             this.line1=l1 ;
             this.line2=l2 ;
             this.city= c;
             this.suburb=s ;
             this.state= st;
             this.pincode= p;
             this.financial_role=r ;
             this.isChosenForMatter = false;
         }
         
         public toString():string {
                  
                  return   this.isChosenForMatter + '\n' +
                      this.bank_name + '\n' +
                      this.rep_name + '\n' +
                      this.rep_title + '\n' +
                      this.address_name + '\n' +
                      this.line1 + '\n' +
                      this.line2 + '\n' +
                      this.city + '\n' +
                      this.suburb + '\n' +
                      this.state + '\n' +
                      this.pincode + '\n' +
                      this.financial_role  + '\n' +
                      this.rep_type_id;
         }
         
    public resetDetails (){
        //this.id=0;----------------------> not sure about this
        this.rep_name ="";
        this.rep_title="";
        this.bank_name = "";
        this.address_name="";
        this.line1 = this.line2 = "";
        this.city="0"; this.suburb="";
        this.state="";
        this.pincode="";
        this.financial_role="";
        this.rep_type_id =0;
    }
    
  
}

