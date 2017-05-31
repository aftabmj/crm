import {inject} from 'aurelia-framework';
import {HttpClient,json} from 'aurelia-fetch-client';
import * as Constants from './constants';

@inject(HttpClient)
export class SpecialDataTable {    
    http;
  message: string;
    users = [];
    statuses = [];
    waitingForDataTransfer:boolean;
   
    
    filters = [
        {value: '', keys: ['bank', 'branch', 'dname', 'sr_num', 'oa_num']},
        {value: '', keys: ['status']},
    ];
    
    constructor(http:HttpClient) {
        
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
        this.waitingForDataTransfer = false;
    }

    getFreshTableData () {
        this.waitingForDataTransfer = true;
        
        this.http.fetch('getPartiesAndMatterData/')
            .then(r => r.json())
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
