import {inject} from 'aurelia-framework';
import {NonIndividualDetails} from  './resources/elements/non-individual-details';
import {HttpClient,json} from 'aurelia-fetch-client';
import * as Constants from './constants';

@inject (HttpClient, NonIndividualDetails)
export class DefendantNonIndividualDetails {    
  message: string;
  
    financial_role_options = [];
    financial_role_selected_option = { id:1, text:'', code:''};
    
    group_type_options = [];
  //  group_type_selected_option = { id:1, text:'', group_type:''};

    rep_types=[];
    selectedGroupTypeId;

  
    public niD: NonIndividualDetails; 
     org_title;
     http;
     waitingForDataTransfer:boolean = false;
     
    constructor(http:HttpClient,niD:NonIndividualDetails) {
        
        http.configure(config => {
                config
                    .withBaseUrl(Constants.default.BACKEND_RESTAPI_ENDPOINT)
                    .withDefaults({
                        headers: {
                            'Content-Type': 'application/json',
                            'Accept': 'application/json'
                        }
                    });
            });
        this.http = http;
        this.niD = niD;
        
        this.financial_role_options = [
            {id:1, text:'Borrower', code:'B'}, 
            {id:2, text:'Guarantor', code:'B'}
        ]; 
        this.financial_role_selected_option = this.financial_role_options[0];
        
        this.group_type_options = [
                {id:'S', text:'Sole Proprietorship',reps:[ {id:4, name: 'Sole Proprietor'},{id:5, name:'Sole Proprietorice'}]},
                {id:'P' , text:'Partnership',   reps:[{id:6, name:'Partner'},{id:7, name:'Managing Partner'}]},
                {id:'V' , text:'Private Ltd. Company', reps:[{id:8, name:'Director'},{id:9, name:'Managing Director'}] },
                {id:'U' , text:'Public Ltd. Company' ,  reps:[{id:10, name:'Chairman'},{id:11, name:'Director'},{id:12, name:'Managing Director'}]}
        ];
        
    }

    groupTypeChanged () {
        let gt = this.group_type_options.filter( x => x.id === this.selectedGroupTypeId);
        
        if (gt && "undefined" !== typeof(gt) && gt[0] && "undefined" !== typeof(gt[0].reps))
               this.rep_types = gt[0].reps;
       
        this.niD.rep_type_id = 0;
    }
    
  saveDefendant() {

    this.niD.financial_role = this.financial_role_selected_option.code;
    console.log (this.niD);
            
    this.niD.address_name = this.niD.bank_name;
    this.niD.state ='Tamil Nadu';
    
    this.waitingForDataTransfer = true;

    this.http.fetch("ni_defendant_details/", {
            method: "post",
            body: json(this.niD),
             headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
    
        }).then(response => {
            alert("Succesfully saved" );
            console.log (response);
            this.resetForm();
            this.waitingForDataTransfer = false;
            
        }) .catch(e => ()=>{
                console.log("Booo");
                alert("Sorry, there was an error communicating with the server.")
                this.waitingForDataTransfer = false;
            });
    }
    
    resetForm(){
        this.financial_role_selected_option = this.financial_role_options[0];
        this.niD.resetDetails();
        this.waitingForDataTransfer = false;
    }
    
     get canSave() {
       // if (this.statusCode === 201) return false;
       
        return !this.waitingForDataTransfer;
    }
}
