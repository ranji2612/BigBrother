//Initial configuration
var express  = require('express');
var app      = express(); 								// create our app w/ express
var port  	 = 8080; 				//
var ipaddr 	 =  "0.0.0.0";
var nodemailer = require('nodemailer');

//Middle-tier configuration
var bodyParser  = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());



// All the minified files will be stored in dist Eg. dist/js/app.min.js
app.use(express.static(__dirname + '/public')); 	// set the static files location
app.use(express.static(__dirname + '/'));

//route file
require('./app/routes/routes.js')(app);

app.get
//Start the awesomeness
app.listen( port, ipaddr, function() {
	console.log('Magic happens on port ', port, ipaddr);
});
