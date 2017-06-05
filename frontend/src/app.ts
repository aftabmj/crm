import {inject} from 'aurelia-framework';
import {RouterConfiguration, Router} from 'aurelia-router';


@inject(Router, RouterConfiguration)
export class App {

    heading ='';
    router;
    public additionalRoutes =[];

    constructor(private isAuthenticated = false, 
                private authToken = null,
                private user = null){
        this.heading =" Welcome !";
        
          /*  
          // Initialize Firebase
          var config = {
            apiKey: "AIzaSyA8I2JVOIgB2hDN5xuSZM0VxyBaByDdIBM",
            authDomain: "lawdb-3375b.firebaseapp.com",
            databaseURL: "https://lawdb-3375b.firebaseio.com",
            projectId: "lawdb-3375b",
            storageBucket: "lawdb-3375b.appspot.com",
            messagingSenderId: "331328854347"
          };
          firebase.initializeApp(config);
        */

       /* firebase.auth().onAuthStateChanged(user=>{
            this.isAuthenticated = user ? true : false;
            this.user = user;
        });*/
    }

/*    login(type) {
        let provider = new firebase.auth.GoogleAuthProvider();
        
        firebase.auth().signInWithPopup(provider).then((result:any)=>{
           this.authToken = result.credential.accessToken;
           this.user = result.user;
           this.isAuthenticated= true;
           
           this.router.navigate('form');  // ->>> TODO to be set 
           
        }).catch(error =>{
           //let errorCode = error.code;
           //let errorMessage
           
               console.log("login error " + error);
            //       ' [' + error.code +']\n' +
            //            ' message :' + error.message + '\n' +
            //            ' email :' + error.email + '\n' +
            //            ' credential :' + error.credential
            //            );
        });
    
    }    
    
    logout (){
        firebase.auth().signOut().then(() => {
            this.isAuthenticated = false;
        }).catch(error =>{
            //throw new Error(error);
            console.log("Logout Error " + error);
        });
    }*/
    
    public setAdditionalRoutesForMatter(matter_id:number){
        this.additionalRoutes= [
         { title:'facilities',  href: '#/m/'+matter_id+'/facilities'},
         {  title: 'applicants' , href:'#/m/'+matter_id+'/applicants'},
         {  title: 'defendants' , href:'#/m/'+matter_id+'/defendants'},
        ];
    }
    
    
    configureRouter(config: RouterConfiguration, router: Router): void {
        config.title = 'O.A. Application';
        config.map([
          { route: '',  title: 'welcome!!', name:'home',  moduleId: 'pages/home/home' , nav:true},
          { route:'applicant', name:'applicant-details', title:'Applicant Details',
             moduleId:'pages/applicant/applicant-details', nav:true},
          { route:'defendant-details', name:'defendant-details', title:'Defendant Details',
             moduleId:'pages/defendant/defendant-details', nav:true},
          { route:'defendant-non-individual', name:'defendant-non-individual', title:'defendant Non-individual details',
             moduleId:'pages/defendant/defendant-non-individual-details', nav:true},
          { route:'review-matter-create', name:'review-matter-create', title:'Review Matter Details',
             moduleId:'pages/matter/review-matter-create', nav:true },
          { route:'m/:id', name:'matter-details', title:'Matter details',
             moduleId:'pages/matter/matter-details', nav:false},
          { route:'m/:id/facilities', name:'facilities', title:'facility details',
             moduleId:'pages/facility/facility-details', nav:false},
          { route:'matter-list', name:'matter-list', title:'data table',
             moduleId:'pages/matter/matter-list', nav:true},
          
         // { route: 'users/:id/detail', name: 'userDetail', moduleId: 'users/detail' },
         // { route: 'files/*path',      name: 'files',      moduleId: 'files/index',   href:'#files',   nav: 0 }
        ]);
         
         //config.mapUnknownRoutes({redirect: '#/'});
         this.router = router;
      }
  
}
