import {inject} from 'aurelia-framework';
import {HttpClient} from 'aurelia-fetch-client';
import {BranchDetails} from '../branch-details';

const BACKEND_RESTAPI_ENDPOINT:string ='https://express-webserver-mjcoder.c9users.io:8080/api/';

@inject(HttpClient)
export class PartyService {
    
    http;   
    constructor(http) {
        
        http.configure(config => {
                config
                    .withBaseUrl(BACKEND_RESTAPI_ENDPOINT)
                    .withDefaults({
                        headers: {
                            'Accept': 'application/json'
                        }
                    });
            });
        this.http = http;
    }
    
    getBranchDetails(address_id:number) : BranchDetails[] {
        
        let branch_list: BranchDetails[] = undefined;
        
        return this.http.fetch('branch_address/' + address_id)
            .then(r => r.json())
            .then(data => branch_list = data)
            .then (aa => () =>
                {    console.log(aa + " " + branch_list);
                return branch_list;
                    
                } );
    
    /*            .catch(e => ()=>{
                console.log("Booo");
                this.branch_list = undefined;
                this.chosenBranch = undefined;
            });
*/
    }
    
    

}