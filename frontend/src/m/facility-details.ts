import {inject} from 'aurelia-framework';
import {HttpClient,json} from 'aurelia-fetch-client';
import {Facility} from '../facility';
import * as Constants from '../constants';

@inject(HttpClient,Facility)
export class FacilityDetails {
    
    showRepayment:boolean;
    waitingForDataTransfer:boolean = false;
    http;
    public f:Facility;
    
    facilityDetails:FacilityDetails;
    
    fType = {   // TODO load this dropdown from the database
        1:'Term Loan',
        2:'Housing Loan',
        3:'Auto Loan',
        4:'Cash Credit'
    };
    
    constructor(http:HttpClient, facility:Facility){
        
       http.configure(config => {
            config
                .withBaseUrl(Constants.default.BACKEND_RESTAPI_ENDPOINT)
                .withDefaults({
                    headers: {
                        'Accept': 'application/json'
                    }
                });
        });
        
        this.http = http;
        
        this.facilityDetails = this;
        this.f = facility;
    }
    
    activate(params)
    {
        this.f.matter_id = params.id;
            //try to load the facility if /detail is asked  or
            //if /new is asked, just get the defendant id from the session
            
        this.showRepayment = true;

    }   
    
    facilityTypeDropdownChanged (): void{
        
       if (this.f.facilityTypeId  === null) {
            console.log ("nothing selected"); return;
        }
        this.showRepayment = (this.f.facilityTypeId  == 4 ) ? false : true;

    }
    
  //  getBorrowerIdForMatter():number{
  //      //this.f.matter_id;
  //      return 42;
  //  }
    
    createFacility (): void {
     
        console.log( " CREATE FACILITY : " + this.f.toString());

        this.waitingForDataTransfer = true;
        
        //query the session storage for matter_id and pass that in
        
       // let borrower_id = this.getBorrowerIdForMatter();
        
        this.http.fetch("f/" , {
            method: "post",
            body: json(this.f),
             headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        }).then(response => {
            alert("Succesfully saved" );
            console.log (response);
            this.f.resetForm ();
            this.waitingForDataTransfer = false;
            
        }) .catch(e => ()=>{
                console.log("Booo");
                alert("Sorry, there was an error communicating with the server.")
                this.waitingForDataTransfer = false;
        });
        
        
    }
    
}
