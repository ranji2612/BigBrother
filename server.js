//Initial configuration
var express  = require('express');
var app      = express(); 								// create our app w/ express
var port  	 = 8080; 				//
var ipaddr 	 =  "0.0.0.0";
var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport('smtps://murder91%40gmail.com:Neversettle\@1234@smtp.gmail.com');
app.post('/email/:key', function(req, res) {
	console.log(req.params.key);
	console.log(req.body);
		var mailOptions = {
      from: 'totran123@gmail.com', // sender address
      to: req.params.key, // list of receivers
      subject: 'Alert: Inappropriate post detected!!', // Subject line
      text: 'The memory usage on one of your droplets is too high! Please review.', // plaintext body
      html: '<b>High Memory</b>' // html bo
    };
    // send mail with defined transport object
    transporter.sendMail(mailOptions, function(error, info){
    if(error){
            return console.log(error);
    }
    console.log('Message sent: ' + info.response);
    });
    /*client.set("key", req.params.key);
    client.expire("key",10)
    res.send('key set for 10 seconds')*/
})

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
