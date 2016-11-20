var nodemailer = require('nodemailer');
var transporter = nodemailer.createTransport('smtps://murder91%40gmail.com:Neversettle\@1234@smtp.gmail.com');
var Users = require('./users.model');
var Posts = require('./posts.model');

module.exports = function(app, passport) {
  app.post('/email/:key', function(req, res) {
  	// console.log(req.params.key);
    // console.log(req.body);
  	// 	var mailOptions = {
    //     from: 'totran123@gmail.com', // sender address
    //     to: req.params.key , // list of receivers
    //     subject: 'Alert: Inappropriate post found!!', // Subject line
    //     text: 'The following post might be inappropriate', // plaintext body
    //     html: 'The following post might be inappropriate<br>'+req.body.data // html bo
    //   };
    //   // send mail with defined transport object
    //   transporter.sendMail(mailOptions, function(error, info){
    //   if(error){
    //           return console.log(error);
    //   }
    //   console.log('Message sent: ' + info.response);
    //   });
    //   /*client.set("key", req.params.key);
    //   client.expire("key",10)
    //   res.send('key set for 10 seconds')*/
  });

  app.post('/report', function(req, res) {
    // console.log('reached', res.body);
    res.json({});
  });

  app.post('/posts/:userID', function(req, res) {
    var inpData = req.body.data;
    console.log('========', inpData);
    Posts.findOneAndUpdate(inpData, {upsert: true}, function(data, err){
      if(err) console.log(err);
      res.json(data);
    });
  });

  app.get('/posts/:userID', function(req, res) {
    Posts.find({'userID': req.params.userID}, function(data, err){
      if(err) console.log(err);
      res.json(data);
    });
  });

  app.post('/user', function(req, res){
      Users.findOneAndUpdate({'userID':req.body.userID}, req.body, { upsert: true}, function(data, err){
        if(err) console.log(err);
        res.json(data);
      });
  });

  app.get('/*', function(req, res){
    res.sendfile('public/index.html');
  });
};
