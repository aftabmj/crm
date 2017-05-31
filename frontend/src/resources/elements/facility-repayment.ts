//import {FacilityDetails} from '../../facility-details';
import {Facility} from '../../facility';

export class FacilityRepayment {
    
    f:Facility;
  /*  f : FacilityDetails;

    activate(facilityVM:FacilityDetails){
        this.f = facilityVM;
    }*/
    activate(facility:Facility){
        this.f = facility;
    }
    
}