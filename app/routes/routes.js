module.exports = function(app, passport) {
  app.get('/*', function(req, res){
    res.sendfile('public/index.html');
  });
};
