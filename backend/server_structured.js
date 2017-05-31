
var express  = require('express'),
    path     = require('path'),
    bodyParser = require('body-parser'),
    app = express();

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({
  extended: true
}));

app.get('/',function(req,res){
    res.send('Welcome');
});

var routes = require('./routes.js'); //uses Express to do the routing.
app.use('/api',routes);              // CORS stuff below must be moved in there too ?


// CORS !! 
//router.use(excors({
//    allowedOrigins: ['http://frontend-mjcoder.c9users.io:8080','http://frontend-mjcoder.c9users.io'] 
//    //, maxAge : 2*60
//}));

//////////////////////////////////////////////////////////////////

function doAuthStuff() {
    var readline = require('readline');
    var google = require('googleapis');
    var OAuth2Client = google.auth.OAuth2;
    var CLIENT_ID = '659553487255-u17insantei4hi3l8ifnhjbrcmb62a1o.apps.googleusercontent.com';
    var CLIENT_SECRET = 'WL53NLcCqS9LEdy0snfLtrJ-';
    var REDIRECT_URL = 'https://express-webserver-mjcoder.c9users.io:8080/api/oauth2callback';

    var oauth2Client = new OAuth2Client(CLIENT_ID, CLIENT_SECRET, REDIRECT_URL);
    
    var rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
}
function getAccessToken (oauth2Client, callback) {
  // generate consent page url
  var url = oauth2Client.generateAuthUrl({
    access_type: 'offline', // will return a refresh token
    scope: ['https://www.googleapis.com/auth/documents',
          'https://www.googleapis.com/auth/drive' // can be a space-delimited string or an array of scopes
          ]
  });
}


//start Server
var server = app.listen(8080,function(){
   console.log("Listening to port %s",server.address().port);
});
