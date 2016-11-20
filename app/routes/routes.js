var nodemailer = require('nodemailer');
var transporter = nodemailer.createTransport('smtps://murder91%40gmail.com:Neversettle\@1234@smtp.gmail.com');
//var Users = require('./users.model');

module.exports = function(app, passport) {
  app.post('/email/:key', function(req, res) {
  	console.log(req.params.key);
    console.log(req.body);
  		var mailOptions = {
        from: 'totran123@gmail.com', // sender address
        to: req.params.key , // list of receivers
        subject: 'Alert: Inappropriate post found!!', // Subject line
        text: 'The following post might be inappropriate', // plaintext body
        html: 'The following post might be inappropriate<br>'+req.body.data // html bo
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
  });

  app.post('/report', function(req, res) {
    console.log('reached', res.body);
    res.json({});
  })

  app.post('/user', function(req, res){
      Users.findOneAndUpdate(req.body, req.body, { new: true , upsert: true})
  });

  app.get('/*', function(req, res){
    res.sendfile('public/index.html');
  });
};
