import * as $ from 'jquery';
//import $ from 'jquery'
//import jQuery from 'jquery'
//window.jQuery = jQuery
//require('../semantic/dist/components/dropdown');
//import * as semantic from 'semantic-ui/semantic';
//import {semanticUI} from  'semantic-ui';
import states from './states-list';


export class States {
    states;
    statesSelect;
    stateSelected;

    constructor() {
        this.states = states; // or load states with http-client, etc.
    }

/*    attached() {
        $(this.statesSelect).dropdown().on('change', e => {
            this.stateSelected = e.target.value;
        });
    }
*/    
}