import {inject} from 'aurelia-framework';
//import {Router} from 'aurelia-router';

import {App} from '../../app';
import {MatterService} from '../../services/matter-service';
import {NonIndividualDetails} from '../../resources/elements/non-individual-details';
import {IndividualDetails} from '../../individual-details';

@inject(MatterService/*,Router*/,App)
export class ReviewMatterCreate {
    
    matterService:MatterService;
    //router;
    app;
    heading:string ='';
    applicants:NonIndividualDetails[];
    defendants_n:NonIndividualDetails[];
    defendants_i:IndividualDetails[];
    cardClass;
    checkboxClass;
    waitingForDataTransfer = false;
            // app is for adding additional routes after the matter is created.
    constructor(matterService:MatterService /*,router:Router*/, app:App) {
        this.matterService = matterService;
        //this.router = router;
        this.app = app;
        this.applicants = [];
        this.defendants_i = [];
        this.defendants_n = [];
        this.cardClass = 'ui raise link card';
        this.checkboxClass= 'ui checkbox hideCheckbox';
        
    }

    
        showCheckbox(element) {
                   this.cardClass = 'ui raise link card clickable';
                   this.checkboxClass ='ui checkbox showCheckbox';
                  //element.childNodes[0].className = 'showCheckbox';
            }

     getCandidatePartiesForMatter() {
        //let d = [];
         this.waitingForDataTransfer = true;
        this.matterService.getCandidatesForMatterCreation()
          .then( (data) => {
                this.applicants = data.applicants;
                this.defendants_i = data.defendants_i;
                this.defendants_n = data.defendants_n;
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
     this.waitingForDataTransfer = true;

     let a = this.getCheckedPartyIds(this.applicants);
     let di = this.getCheckedPartyIds(this.defendants_i);
     let dn = this.getCheckedPartyIds(this.defendants_n);
     let d = di.concat(dn);

     this.matterService.createNewMatter(a,d)
        .then(data => {
                this.heading =data.heading;
                console.log("Matter Id " + data.matter_id );
            //TODO : set child router
            //this.router.navigate("m/"+matter_id+"/facility");
            //http://frontend-mjcoder.c9users.io:8080/#/m/29/facilities
            this.app.setAdditionalRoutesForMatter(data.matter_id);
            this.waitingForDataTransfer = false;
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

