import {inject} from 'aurelia-framework';
import {MatterService} from '../../services/matter-service';

@inject(MatterService)
export class MatterList {    
    http;
    message: string;
    users = [];                               // TODO : replace with MatterListingItem
    statuses = [];
    waitingForDataTransfer:boolean;
   private matterService:MatterService;
    
    filters = [
        {value: '', keys: ['bank', 'branch', 'dname', 'sr_num', 'oa_num']},
        {value: '', keys: ['status']},
    ];
    
     constructor(mS:MatterService) {
        this.matterService = mS;
        this.waitingForDataTransfer = false;
    }

    getFreshTableData () {
        this.waitingForDataTransfer = true;

         this.matterService.getAllMatters()
            .then(data => {
                 //console.log(" response first row " + JSON.stringify(data[0]));
                    this.users = data;
                      this.populateStatuses();
                       this.waitingForDataTransfer = false;
                    return this.users;
            })
            .catch(e => ()=>{
                console.log("Booo");
                alert("Sorry, there was an error communicating with the server.")
                
                this.waitingForDataTransfer = false;
          });
        
    }
    
    activate(){
        this.getFreshTableData();
    }
    
      /*bind() {
            this.populateStatuses();
            return this.users;
    }*/
    
    
     populateStatuses(){
        this.statuses.push('');
        for(let next of this.users){
            let status = next.status;

            if(this.statuses.indexOf(status) === -1){
                this.statuses.push(status);
            }
        }
    }
}
