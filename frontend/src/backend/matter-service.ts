import {json} from 'aurelia-fetch-client';
import {HttpService} from './http-service';
import {Matter} from '../matter';
import {MatterListingItem} from '../matter-listing-item';
import {NonIndividualDetails} from '../resources/elements/non-individual-details';
import {IndividualDetails} from '../individual-details';

export class MatterService  extends HttpService{
  applicants:NonIndividualDetails[];
  defendants_n:NonIndividualDetails[];
  defendants_i:IndividualDetails[];


  public createNewMatter(applicant_ids,defendant_ids): Promise<any> {

      // we want other ids not used to be zero. so start with a zero filled array
      let apl_ids = Array.apply(null, Array(2)).map(Number.prototype.valueOf,0);
      let def_ids = Array.apply(null, Array(4)).map(Number.prototype.valueOf,0);

     for (let i =0 ;i< applicant_ids.length; i++) {   apl_ids[i] = applicant_ids[i];  }
     for (let i =0 ;i< defendant_ids.length; i++) {   def_ids[i] = defendant_ids[i];  }
 
      return this.http.fetch("m/", {
            method: "post",
            body: json({
                    applicant_ids:apl_ids,
                    defendant_ids:def_ids
                })
        })  
        .then(r => r.json())
        .then(data => {
                return {
                    heading:  JSON.stringify(data),
                    matter_id:parseInt(data['@matter_id'])
                };                
        });


  }

  public getCandidatesForMatterCreation(): Promise<any> {
     
    return this.http.fetch('c/')
            .then(r => r.json())
            .then(data => {
                this.processNonIndividuals(data[0]);
                this.processDefendants( data[1]);
            }).then(data => {
                return {
                  applicants: this.applicants,
                  defendants_n:this.defendants_n,
                  defendants_i:this.defendants_i
                };
            });
    
  }

  public getMatterById(matterId:number): Promise<Matter> {

     return this.http.fetch('m/' + matterId)
            .then(r => r.json())
            .then(data => {
                let m:Matter = new Matter(matterId, data[0], data[1], data[2]);
              
                for (var i =0; i< data[3].length; i++)
                    m.defendants.push(data[3][i]);
               //// do i need todo this:
               // data =m;  //??????????????????????//
               return m;
            });
          
    }

  public getAllMatters() : Promise<any>{ //MatterListingItem
   
    return this.http.fetch('m/')
          .then(r => r.json());
        //errors caught by caller
  }



    processDefendants(d){
       //this.defendants = new IndividualDetails[d.length];
        for (var i =0; i< d.length;i++) {
            //d[i].isChecked= false;
            let defendant = new IndividualDetails (
                    d[i]['id'],  d[i]['saluation'],
                    d[i]['first_name'], d[i]['middle_name'],  d[i]['last_name'],
                    d[i]['relative_name'], d[i]['relative_type'],
                    d[i]['address_name'],d[i]['line1'],  d[i]['line2'],
                    d[i]['city'], d[i]['suburb'],
                    d[i]['state'],  d[i]['pincode'],
                    d[i]['financial_role'], d[i]['occupation']
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
                 this.defendants_n.push(nonIndi);
            }
            //objType.push(d[i]);
        }
    }





}
