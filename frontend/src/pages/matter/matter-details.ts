import {inject} from 'aurelia-framework';
import {MatterService} from '../../services/matter-service';
import * as Constants from '../../constants';
import {Matter} from '../../matter';

@inject(MatterService)
export class MatterDetails {
    
    http;
    private matterService:MatterService;
    matter_id;
    waitingForDataTransfer:boolean;
    matter:Matter;
    
     constructor(mS:MatterService) {
        this.matterService = mS;
        this.waitingForDataTransfer = false;
     }
     
     activate (params) {
        this.matter_id = params.id;
        this.waitingForDataTransfer = true;
    
/*        this.http.fetch('m/' + this.matter_id)
            .then(r => r.json())
            .then(data => {
                this.matter_details=data[0];
                this.applicants = data[1];
                this.defendants = data[2];
                for (var i =0; i< data[3].length; i++)
                    this.defendants.push(data[3][i]);
  */

                // we want to show Borrowers first B < G (guarantors)
               /* this.defendants.sort((a,b) => 
                        { return (
                            (a.financial_role+0) - (b.financial_role+0)
                            ) 
                        });*/  // DID NOT WORK
                        
                        
               // console.log(this.defendants);
//                 console.log(" response applicants " + JSON.stringify(data[0]));
  //              console.log(" response defendants " + JSON.stringify(data[1]));
                    //this.matter_details=data;
  //              })
        this.matterService.getMatterById(this.matter_id)
            .then( (matter:Matter) =>{ 
                this.matter = matter;
                console.log(" Matter " + matter );
                //return this.matter;
            })
            .catch(e => ()=>{
                console.log("Booo");
                alert("Sorry, there was an error communicating with the server.")
                
                this.waitingForDataTransfer = false;
          });
          
        
    }


}
