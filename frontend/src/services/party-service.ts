import {HttpService} from './http-service';
import {json} from 'aurelia-fetch-client';
import {IndividualDetails} from  '../individual-details';
import {NonIndividualDetails} from  '../resources/elements/non-individual-details';


export class PartyService extends HttpService {
    
    public addApplicant(bankId:number,branchAddrId:number,repTitle:string) :Promise<any> {
          return  this.http.fetch("a/", {
            method: "post",
            body: json({
                bank_id:bankId, //parseInt(this.selectedBankId), //assumption (see comment on top)
                branch_addr_id:branchAddrId,
                rep_title:repTitle
            }),
            mode:'cors-with-forced-preflight' // THIS IS THE KEY !! 
                                //OPTIMIZATION :have a session-key "LAST preflight POST TIME" (millis)
                                            // if that is close to the maxAge set in the cors-settings, then force it.
          });
          
    }

 public addIndividualDefendant(individualDefendant:IndividualDetails) :Promise<any> {
          return  this.http.fetch("id/", {
            method: "post",
            body: json(individualDefendant)
            /*,
              headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }*/
          });
    }

 public addNonIndividualDefendant(nonIndividualDefendant:NonIndividualDetails) :Promise<any> {
          return  this.http.fetch("nd/", {
            method: "post",
            body: json(nonIndividualDefendant)
            /*,
              headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }*/
          });
    }



}
