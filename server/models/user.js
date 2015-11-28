var mongoose       = require('mongoose');
var User = mongoose.model('User');

exports.getAllUsers = function(req, res, next) {
  User.find(function(err, users) {
    res.send(users);
  });
};

exports.getUser = function(req, res, next) {
  User.findById(req.params.id, function(err, user) {
    res.send(user);
  });
};
