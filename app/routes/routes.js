var nodemailer = require('nodemailer');
var transporter = nodemailer.createTransport('smtps://murder91%40gmail.com:Neversettle\@1234@smtp.gmail.com');
var Users = require('./users.model');
var Posts = require('./posts.model');

module.exports = function(app, passport) {
  app.post('/email/:key', function(req, res) {
    console.log(req.params.key);
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
    //   /*client.set("key", req.params.key);
    //   client.expire("key",10)
    //   res.send('key set for 10 seconds')*/
  });

  app.get('/report/:userID/post/:postID/status/:status', function(req, res) {
    console.log('reached', res.body);
    var val = 0;
    if (req.params.status === 'true') {val = 1;}
    Users.findOneAndUpdate({'userID':req.params.userID}, {$inc : {score : val}}, { upsert: true}, function(err, data){
      if(err) console.log(err);
      Posts.findOneAndUpdate({'id': req.params.postID}, {'status' : req.params.status},{upsert:true}, function(err, data){
        if(err) console.log(err);
        res.json(data);
      });
    });
  });

  app.post('/posts/:userID', function(req, res) {
    var inpData = req.body;
    inpData['status'] = 'pending';
    inpData['userID'] = req.params.userID;
    Posts.findOneAndUpdate({'id': req.body.id}, inpData,{upsert:true}, function(err, data){
      if(err) console.log(err);
      res.json(data);
    });
  });

  app.get('/posts/:userID', function(req, res) {
    Posts.find({'userID': req.params.userID, 'status': { $in : ['pending', 'true']}}, function(err, data){
      if(err) {console.log(err);}
      res.json(data);
    });
  });

  app.get('/posts/postid/:postID', function(req, res) {
    // Usage Eg. $http.get('/posts/postid/'+postID)
    Posts.find({'id': { "$regex": req.params.postID, "$options": "i" }, 'status': {$in : ['pending', 'true']}}, function(err, data){
      if(err) {console.log(err);}
      res.json(data);
    });
  });

  app.post('/user', function(req, res){
    Users.findOneAndUpdate({'userID':req.body.userID}, req.body, { upsert: true}, function(err, data){
      if(err) console.log(err);
      res.json(data);
    });
  });

  app.get('/stats/:userID', function(req, res){
    var result = {};
    Posts.count({'userID': req.params.userID, 'status': 'true'}, function(err, data){
      result.true = data;
      Posts.count({'userID': req.params.userID, 'status': 'pending'}, function(err, data1){
        result.pending = data1;
        Posts.count({'userID': req.params.userID, 'status': 'false'}, function(err, data2){
          result.false = data2;
          res.json(result);
        });
      });
    });

  });

  app.get('/*', function(req, res){
    res.sendfile('public/index.html');
  });
};
