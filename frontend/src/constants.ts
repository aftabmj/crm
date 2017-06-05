
export default {
 //BACKEND_RESTAPI_ENDPOINT: 'http://express-webserver-mjcoder.c9users.io:8080/api/'
 BACKEND_RESTAPI_ENDPOINT : 'http://localhost:8080/api/',
 GROUP_TYPE_OPTIONS : [
        {id:'S', text:'Sole Proprietorship',
          reps:[ {id:4, name: 'Sole Proprietor'},{id:5, name:'Sole Proprietorice'}]},
        {id:'P' , text:'Partnership', 
          reps:[{id:6, name:'Partner'},{id:7, name:'Managing Partner'}]},
        {id:'V' , text:'Private Ltd. Company', 
          reps:[{id:8, name:'Director'},{id:9, name:'Managing Director'}] },
        {id:'U' , text:'Public Ltd. Company' ,  
          reps:[{id:10, name:'Chairman'},{id:11, name:'Director'},{id:12, name:'Managing Director'}]}
      ]
};
