import {inject} from 'aurelia-framework';
import {NonIndividualDetails} from  '../../resources/elements/non-individual-details';
import * as Constants from '../../constants';
import {PartyService} from '../../services/party-service';

@inject (PartyService, NonIndividualDetails)
export class DefendantNonIndividualDetails {    
    message: string;
    partyService:PartyService;
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
     
    constructor(partyService:PartyService,niD:NonIndividualDetails) {

      this.partyService = partyService;
        this.niD = niD;
        
        this.financial_role_options = [
            {id:1, text:'Borrower', code:'B'}, 
            {id:2, text:'Guarantor', code:'G'}
        ]; 
        this.financial_role_selected_option = this.financial_role_options[0];
        
        this.group_type_options = Constants.default.GROUP_TYPE_OPTIONS;
        
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

    this.partyService.addNonIndividualDefendant(this.niD)
    .then(response => {
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
