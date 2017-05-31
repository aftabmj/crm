import {Aurelia} from 'aurelia-framework'
import environment from './environment';
//import {Login} from './login';
//import {AuthService} from './backend/auth-service';

export function configure(aurelia: Aurelia) {
  aurelia.use
    .standardConfiguration()
     .plugin('aurelia-table')
    .feature('resources');
//    .plugin('semantic-ui');

  if (environment.debug) {
    aurelia.use.developmentLogging();
  }

  if (environment.testing) {
    aurelia.use.plugin('aurelia-testing');
  }

  aurelia.start().then(() => aurelia.setRoot());
  //http://davismj.me/blog/aurelia-auth-pt2/
     // After starting the aurelia, we can request the AuthService directly
    // from the DI container on the aurelia object. We can then set the 
    // correct root by querying the AuthService's isAuthenticated method.
    /*aurelia.start().then(() => {
      var auth = aurelia.container.get(AuthService);
      let root = auth.isAuthenticated() ? 'app' : 'login';
      aurelia.setRoot(root);
    });*/
}
