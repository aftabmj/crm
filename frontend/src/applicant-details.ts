import {inject} from 'aurelia-framework';
//import {PartyService} from './backend/party-service';
//import { observable } from 'aurelia-framework';
import {HttpClient,json} from 'aurelia-fetch-client';
import {BranchDetails} from './branch-details';

import {Router} from 'aurelia-router';
import * as Constants from './constants';

//@inject(PartyService)
@inject(HttpClient, Router)
export class ApplicantDetails {
    
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

    
    constructor(http:HttpClient,router:Router) {
        
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
        this.router = router;
    }
    
//    constructor(private partyService:PartyService){
        //load BranchDetails and chosen branch from session ?
        
//    }

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
        this.http.fetch("a/", {
            method: "post",
            body: json({
                bank_id:parseInt(this.selectedBankId), //assumption (see comment on top)
                branch_addr_id:this.chosenBranch.address_id,
                rep_title:repTitle,
                case_side:'A'
            }),
            mode:'cors-with-forced-preflight' // THIS IS THE KEY !! 
                                //OPTIMIZATION :have a session-key "LAST preflight POST TIME" (millis)
                                            // if that is close to the maxAge set in the cors-settings, then force it.
        })
        .then(response => response.json())
        .then( data => {
            alert("Succesfully saved" + JSON.stringify(data));
            
            console.log (data);
            this.waitingForDataTransfer = false;
             //this.router.navigate("defendant-details");

        }).then(()=>{
                this.branch_list = undefined;
                this.chosenBranch = undefined;
                this.selectedBankId=null;
                this.rep_title =undefined;

        });
    }
    
    bankDropdownChanged() {
        if (this.selectedBankId ===null){
            this.branch_list = undefined;
            this.chosenBranch = undefined;
            return;
        }
//      this.parent.fields.

      //this.waitingForDataTransfer = true;

      this.http.fetch('b/' + parseInt(this.selectedBankId) +'/branches' )
            .then(r => r.json())
            .then(data => this.branch_list = data)
           // .then(e => () => {
                //this.waitingForDataTransfer = false;   
           // })
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

  /* try {
        this.partyService.
                            getBranchDetails(changedValue)
                            .then ( b => this.branch_list = b );
      }catch (e){
                console.log("Booo");
                this.branch_list = undefined;
                this.chosenBranch = undefined;
      }*/
