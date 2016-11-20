var nodemailer = require('nodemailer');
var transporter = nodemailer.createTransport('smtps://murder91%40gmail.com:Neversettle\@1234@smtp.gmail.com');
var Users = require('./users.model');

module.exports = function(app, passport) {
  app.get('/email/:key', function(req, res) {
  	console.log(req.params.key);
  		var mailOptions = {
        from: 'totran123@gmail.com', // sender address
        to: req.params.key + '@gmail.com', // list of receivers
        subject: 'Alert: Memory usage high!!', // Subject line
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
