import {inject} from 'aurelia-framework';
//import { observable } from 'aurelia-framework';
//import {PartyService} from './backend/party-service';
//import {SuggestionService} from './backend/suggestion-service';
//import * from './styles/semantic.min/semantic-ui';
//import 'semantic-ui';
import {IndividualDetails} from  './individual-details';
import {HttpClient,json} from 'aurelia-fetch-client';
import * as Constants from './constants';
/*
export class PeriodPanel {
    options = [];
    selectedOption = {
            id:1
    };

    constructor() {
        this.options = [
            {id:1, text:'Borrower'}, 
            {id:2, text:'Guarantor'}
        ]; 
        this.selectedOption = this.options[0];
    }

    clicked() {
      console.log(this.selectedOption.id);
      return true;
    }
}*/


//@inject(PartyService)
@inject(HttpClient, IndividualDetails)
export class DefendantDetails {
  
    financial_role_options = [];
    financial_role_selected_option = { id:1, text:''};
  
    relative_options = [];
    relative_selected_option = { id:1, text:'' ,value:''};
  
    public iD: IndividualDetails; 
   
    //partyService;
    http;
     //@observable({changeHandler: 'dataTransStatusChanged'}) 
     waitingForDataTransfer:boolean = false;
   /*
    model = {
    country: null,
    city: null
  };
  
  suggestionService = null;
  
  countryIndex = null;
  
  activate() {
    return this.http.fetch('/countries.json',
      .then(response => response.json())
      .then(countries => {
        this.countryIndex = countries;
        this.suggestionService = new SuggestionService(this.model, countries);
      });
  }*/
     
    constructor(http:HttpClient,iD:IndividualDetails) {
        
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
        this.iD = iD;
        
        this.financial_role_options = [
            {id:1, text:'Borrower'}, 
            {id:2, text:'Guarantor'}
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

        this.iD.financial_role = this.financial_role_selected_option.text;
        this.iD.relative_type = this.relative_selected_option.value;
        console.log (this.iD);
            
        this.iD.address_name = 'Home address';
        this.iD.state ='Tamil Nadu';
    
        this.waitingForDataTransfer = true;
        this.http.fetch("id/", {
            method: "post",
            body: json(this.iD),
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
        this.relative_selected_option = this.relative_options[0];
        this.iD.resetDetails();
        this.waitingForDataTransfer = false;
    }
    
     get canSave() {
       // if (this.statusCode === 201) return false;
       
        return !this.waitingForDataTransfer;
    }
    
}
