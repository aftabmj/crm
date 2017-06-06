import {inject} from 'aurelia-framework';
import {HttpClient} from 'aurelia-fetch-client';
import * as Constants from '../constants';

@inject(HttpClient)
export class HttpService {
    
    constructor(protected http:HttpClient) {
        
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
    }

}
