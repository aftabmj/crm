import {inject} from 'aurelia-framework';
//import {PartyService} from './backend/party-service';
import {App} from './app';
import {HttpClient,json} from 'aurelia-fetch-client';
import {NonIndividualDetails} from './resources/elements/non-individual-details';
import {IndividualDetails} from './individual-details';
import {Router} from 'aurelia-router';
import * as Constants from './constants';

@inject(HttpClient,Router,App)
export class ReviewMatterCreate {
    
    http;
    router;
    app;
    heading:string ='';
    applicants:NonIndividualDetails[];
    defendants_n:NonIndividualDetails[];
    defendants_i:IndividualDetails[];
    cardClass;
    checkboxClass;
    waitingForDataTransfer = false;
    
    constructor(http:HttpClient ,router:Router, app:App) {
        
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
        this.router = router;
        this.app = app;
        this.applicants = [];
        this.defendants_i = [];
        this.defendants_n = [];
        this.cardClass = 'ui raise link card';
        this.checkboxClass= 'ui checkbox hideCheckbox';
        
    }
    processDefendants(d){
       //this.defendants = new IndividualDetails[d.length];
        for (var i =0; i< d.length;i++) {
            //d[i].isChecked= false;
            let defendant = new IndividualDetails (
                    d[i]['id'],
                    d[i]['saluation'],
                    d[i]['first_name'],
                    d[i]['middle_name'],
                    d[i]['last_name'],
                    d[i]['relative_name'],
                    d[i]['relative_type'],
                    d[i]['address_name'],
                    d[i]['line1'],
                    d[i]['line2'],
                    d[i]['city'],
                    d[i]['suburb'],
                    d[i]['state'],
                    d[i]['pincode'],
                    d[i]['financial_role'],
                    d[i]['occupation']
                );
            this.defendants_i.push( defendant);
            //objType.push(d[i]);
        }
    }

//processApplicants
    /*processNonIndividuals(objType,d){
      // this.applicants = new NonIndividualDetails[d.length];
        for (var i =0; i< d.length;i++) {
            //d[i].isChecked= false;
            let applicant = new NonIndividualDetails (
                    d[i]['id'],
                    d[i]['bank_name'],
                    d[i]['rep_name'],
                    d[i]['rep_title'],
                    d[i]['address_name'],
                    d[i]['line1'],
                    d[i]['line2'],
                    d[i]['city'],
                    d[i]['suburb'],
                    d[i]['state'],
                    d[i]['pincode'],
                    d[i]['financial_role']
                );
            this.applicants.push( applicant);
            //objType.push(d[i]);
        }
    }*/
    
    processNonIndividuals(d){
      // this.applicants = new NonIndividualDetails[d.length];
        for (var i =0; i< d.length;i++) {
            //d[i].isChecked= false;
            
            let nonIndi = new NonIndividualDetails (
                    d[i]['id'],
                    d[i]['org_name'],
                    d[i]['rep_name'],
                    d[i]['rep_title'],
                    d[i]['address_name'],
                    d[i]['line1'],
                    d[i]['line2'],
                    d[i]['city'],
                    d[i]['suburb'],
                    d[i]['state'],
                    d[i]['pincode'],
                    d[i]['financial_role']
            );
            console.log(  d[i]);
            
            if(d[i].case_side ==='A') {
                this.applicants.push( nonIndi);
            } else {
                 this.defendants_n.push( nonIndi);
            }
            //objType.push(d[i]);
        }
    }
    
        showCheckbox(element) {
                   this.cardClass = 'ui raise link card clickable';
                   this.checkboxClass ='ui checkbox showCheckbox';
                  //element.childNodes[0].className = 'showCheckbox';
            }

     getCandidatePartiesForMatter() {
        //let d = [];
        
        this.http.fetch('getCandidatesForMatter/')
            .then(r => r.json())
            .then(data => {
              //   console.log(" response applicants " + JSON.stringify(data[0]));
               // console.log(" response defendants " + JSON.stringify(data[1]));
               // this.processNonIndividuals(this.applicants, data[0]);
                this.processNonIndividuals(data[0]);
                this.processDefendants( data[1]);
                })
            
            .catch(e => ()=>{
                console.log("Booo");
                alert("Sorry, there was an error communicating with the server.")
                
                this.waitingForDataTransfer = false;
            });

    }
    
    activate() {
        this.getCandidatePartiesForMatter();
    }
    
    getCheckedPartyIds (partyObjects){
      return partyObjects
            .filter(a =>  a.isChosenForMatter)
            .map(b => b.id);
    }
     deleteCardApplicant(app) {
        var index:number = this.applicants.indexOf(app, 0);
        if (index > -1) {
           this.applicants.splice(index, 1);//TODO : delete from server ----------------------------------------------
        }
     }
    
    deleteCardDefendant(def) {
        var index:number = this.defendants_i.indexOf(def, 0);
        if (index > -1) {
           this.defendants_i.splice(index, 1);//TODO : delete from server ----------------------------------------------
        } else {
                index =this.defendants_n.indexOf(def, 0) ;
                if (index > -1) {
                    this.defendants_n.splice(index, 1);//TO-----------------------------
                }
            }
    }
    
    createMatter(){
        
      //this.getCheckedParties();
      //return;
     this.waitingForDataTransfer = true;
    let apl_ids = Array.apply(null, Array(2)).map(Number.prototype.valueOf,0);
    let def_ids = Array.apply(null, Array(4)).map(Number.prototype.valueOf,0);
    
     let a = this.getCheckedPartyIds(this.applicants);
     for (let i =0 ;i< a.length; i++) {   apl_ids[i] = a[i];  }
     
     let b = this.getCheckedPartyIds(this.defendants_i);
     let i =0;
     for ( ;i< b.length; i++) {   def_ids[i] = b[i];  }

     b = this.getCheckedPartyIds(this.defendants_n);
     for (let j =0 ;j< b.length; j++) {   def_ids[i++] = b[j];  }
    
     this.http.fetch("createMatter/", {
            method: "post",
            body: json({
                    applicant_ids:apl_ids,
                    defendant_ids:def_ids
                }),
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        })  
        .then(r => r.json())
        .then(data => {
                this.heading = JSON.stringify(data);
                
                let matter_id = parseInt(data['@matter_id']);
                console.log("Matter Id " + matter_id );
            this.waitingForDataTransfer = false;
            //this.router.
            //this.router.navigate("m/"+matter_id+"/facility");
            //http://frontend-mjcoder.c9users.io:8080/#/m/29/facilities
            this.app.setAdditionalRoutesForMatter(matter_id);
        })
         .catch(e => ()=>{
                console.log("Booo");
                alert("Sorry, there was an error communicating with the server.")
                this.waitingForDataTransfer = false;
            });
            
    }
    
    get canSave():boolean { 
        
         let zero:any =0; // yeah...this is required because ts is weird like that !
         let defsi = this.getCheckedPartyIds(this.defendants_i) ;
         let defsn = this.getCheckedPartyIds(this.defendants_n) ;
         let apps = this.getCheckedPartyIds(this.applicants) ;

         return (defsi.length + defsn.length != zero) && (apps.length != zero) ;
    }

}

