import {inject} from 'aurelia-framework';
//import { observable } from 'aurelia-framework';
//import {SuggestionService} from './backend/suggestion-service';
//import * from './styles/semantic.min/semantic-ui';
//import 'semantic-ui';
import {IndividualDetails} from  '../../individual-details';
import {PartyService} from '../../services/party-service';

@inject(PartyService, IndividualDetails)
export class DefendantDetails {
  
    financial_role_options = [];
    financial_role_selected_option = { id:1, text:'', code:''};
  
    relative_options = [];
    relative_selected_option = { id:1, text:'' ,value:''};
  
    private partyService:PartyService;
  
    public iD: IndividualDetails; 
    waitingForDataTransfer:boolean = false;
     
    constructor(partyService:PartyService,iD:IndividualDetails) {
        
        this.partyService= partyService;
        this.iD = iD;
        
        this.financial_role_options = [
            {id:1, text:'Borrower', code:'B'}, 
            {id:2, text:'Guarantor', code:'G'}
        ]; 
        this.financial_role_selected_option = this.financial_role_options[0];
        
        this.relative_options = [
            {id:1, text:'Son/Daughter of' , value:'father'}, 
            {id:2, text:'Wife of' , value : 'husband'}
        ]; 
        this.relative_selected_option = this.relative_options[0];
    
    }

    /*logit() {
       // console.log(option);
        console.log("saluation : " + this.iD.saluation);
        
    }*/
    
    saveDefendant(){

        this.iD.financial_role = this.financial_role_selected_option.code;
        this.iD.relative_type = this.relative_selected_option.value;
        console.log (this.iD);
            
        this.iD.address_name = 'Home address';
        this.iD.state ='Tamil Nadu';
    
        this.waitingForDataTransfer = true;

        this.partyService.addIndividualDefendant(this.iD)    
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
        this.relative_selected_option = this.relative_options[0];
        this.iD.resetDetails();
    }
    
     get canSave() {
       // if (this.statusCode === 201) return false;
       
        return !this.waitingForDataTransfer;
    }
    
}
