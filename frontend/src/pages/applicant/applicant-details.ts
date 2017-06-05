import {inject} from 'aurelia-framework';
import {BankService} from '../../backend/bank-service';
import {PartyService} from '../../backend/party-service';
//import { observable } from 'aurelia-framework';
import {HttpClient,json} from 'aurelia-fetch-client';
import {BranchDetails} from '../../branch-details';

import {Router} from 'aurelia-router';
import * as Constants from '../../constants';

@inject(PartyService, BankService, Router)
export class ApplicantDetails {
    
    private partyService:PartyService;
    private bankService:BankService;
    
    branch_list:BranchDetails[]; 
    selectedBankId:string;
    chosenBranch:BranchDetails;
    waitingForDataTransfer = false;
    rep_title:string;
    http;
    router;
    
//    chosenBankId:number =0;        // a big assumption the <options> 
                                // has hard coded 1-6 which is being used as the
                                // bankId below in bankDropdownChanged .
    
    //@observable({changeHandler: 'dataTransStatusChanged'}) waitingForDataTransfer = false;
    /*dataTransStatusChanged(newValue,oldValue) {
        console.log( "waitingForDataTransfer  changed from " + oldValue + " to " +newValue);    
    }*/

    constructor(partyService:PartyService, bankService:BankService){
      this.partyService = partyService;
      this.bankService = bankService;
        //load BranchDetails and chosen branch from session ?        
    }

/*in bank_id int default 0,
in branch_addr_id int default 0, --from branchAddress table
in rep_first_name varchar(50),
in rep_last_name varchar(50),
in rep_title varchar(50))*/

    createApplicant(){
        let rep_type_names ={"1": "Branch Manager", 
          "2":"Chief Manager", "3":"Assistant General Manager" };
        
        let repTitle:string = rep_type_names[this.rep_title];
        
        if (repTitle === undefined) {
            console.log("not selected");
            alert("repTitle was empty");
            return;
        }
        
        this.waitingForDataTransfer =true;

        this.partyService.addApplicant(
        parseInt(this.selectedBankId),this.chosenBranch.address_id,repTitle)
          .then(()=>{
                  alert("Succesfully saved" );  
                  this.branch_list = undefined;
                  this.chosenBranch = undefined;
                  this.selectedBankId=null;
                  this.rep_title =undefined;
                  this.waitingForDataTransfer = false;
          });
    }
    
    bankDropdownChanged() {
        if (this.selectedBankId ===null){
            this.branch_list = undefined;
            this.chosenBranch = undefined;
            return;
        }

      this.bankService.getBranchDetails(parseInt(this.selectedBankId))
            .then(data => this.branch_list = data)
            .catch(e => ()=>{
                  console.log("Booo");
                  alert("Sorry, there was an error communicating with the server.")
                  this.branch_list = undefined;
                  this.chosenBranch = undefined;
                  //this.waitingForDataTransfer = false;
          });
  
    }
  
    branchDropdownChanged(changedAddressId) {
      //TODO change to find ?
      this.chosenBranch = this.branch_list.filter(function( branch ) {
            if( branch.address_id === changedAddressId){
                console.log(branch);
                return branch;
            }
        })[0];
    }
    
     get canSave() {
       // if (this.statusCode === 201) return false;
        return (//typeof this.chosenBranch !== "undefined"
                //!this.waitingForDataTransfer 
                //&& 
                this.chosenBranch != null && parseInt(this.rep_title)>0);
        }
    
}
