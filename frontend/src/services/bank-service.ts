import {HttpService} from './http-service';
import {BranchDetails} from '../branch-details';

export class BankService  extends HttpService{

    public getBranchDetails(selectedBankId:number) : Promise<BranchDetails[]> {
        
        let branch_list: BranchDetails[] = undefined;
        
        //TODO: check the SW cache first 


        //TODO :store in the cache before returning ?
        return this.http.fetch('b/' + selectedBankId +'/branches' )
            .then(r => r.json())
            .then(data => branch_list = data);
    }
}
