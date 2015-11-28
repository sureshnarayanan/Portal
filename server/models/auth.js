// grab the mongoose module
var path = require('path');
var qs = require('querystring');
var async = require('async');
var bcrypt = require('bcryptjs');
var colors = require('colors');
var cors = require('cors');
var mongoose       = require('mongoose');
var bodyParser     = require('body-parser');
var methodOverride = require('method-override');
var logger = require('morgan');
var jwt = require('jwt-simple');
var moment = require('moment');
var request = require('request');
// config files
var config = require('../config/config');

var userSchema = new mongoose.Schema({
  email         : { type: String, unique: true, lowercase: true },
  password      : { type: String, select: false },
  picture       : String,
  displayName   : String,
  firstName     : String,
  lastName      : String,
  facebook      : String,
  google        : String,
  preference    : String,
  address          :{
      addressLine1 : String,
      addressLine2 : String,
      city         : String,
      state        : String,
      zipCode      : String,
      country      : String
    },
  billing                   : {
      cardNumber            : String,
      cardName              : String,
      cardExpirationMonth   : Number,
      cardExpirationYear    : Number
  }
});

userSchema.pre('save', function(next) {
  var user = this;
  if (!user.isModified('password')) {
    return next();
  }
  bcrypt.genSalt(10, function(err, salt) {
    bcrypt.hash(user.password, salt, function(err, hash) {
      user.password = hash;
      next();
    });
  });
});

userSchema.methods.comparePassword = function(password, done) {
  bcrypt.compare(password, this.password, function(err, isMatch) {
    done(err, isMatch);
  });
};

var User = mongoose.model('User', userSchema);

mongoose.connect(config.db);
mongoose.connection.on('error', function(err) {
  console.log('Error: Could not connect to MongoDB. Did you forget to run `mongod`?'.red);
});
/*
 |--------------------------------------------------------------------------
 | Login Required Middleware
 |--------------------------------------------------------------------------
 */
 exports.isAuthenticated = function (req, res, next) {
   if (!req.headers.authorization) {
     return res.status(401).send({ message: 'Please make sure your request has an Authorization header' });
   }
   var token = req.headers.authorization.split(' ')[1];

   var payload = null;
   try {
     payload = jwt.decode(token, config.TOKEN_SECRET);
   }
   catch (err) {
     return res.status(401).send({ message: err.message });
   }

   if (payload.exp <= moment().unix()) {
     return res.status(401).send({ message: 'Token has expired' });
   }
   req.user = payload.sub;
   next();
 };


/*
 |--------------------------------------------------------------------------
 | Generate JSON Web Token
 |--------------------------------------------------------------------------
 */
function createJWT(user) {
  var payload = {
    sub: user._id,
    iat: moment().unix(),
    exp: moment().add(14, 'days').unix()
  };
  return jwt.encode(payload, config.TOKEN_SECRET);
}

/*
 |--------------------------------------------------------------------------
 | GET /api/me
 |--------------------------------------------------------------------------
 */
 exports.getUserProfile = function(req, res, next) {
	 User.findById(req.user, function(err, user) {
		 res.send(user);
	 });
};

/*
 |--------------------------------------------------------------------------
 | PUT /api/me
 |--------------------------------------------------------------------------
 */
exports.updateUserProfile =  function(req, res) {
  User.findById(req.user, function(err, user) {
    if (!user) {
      return res.status(400).send({ message: 'User not found' });
    }
    user.displayName = req.body.displayName || user.displayName;
    user.email = req.body.email || user.email;

    user.address.addressLine1 = req.body.address.addressLine1 || user.address.addressLine1;
    user.address.addressLine2 = req.body.address.addressLine2 || user.address.addressLine2;
    user.address.city = req.body.address.city || user.address.city;
    user.address.state = req.body.address.state || user.address.state;
    user.address.zipCode = req.body.address.zipCode || user.address.zipCode;
    user.address.country = req.body.address.country || user.address.country;

  //  user.billing.cardNumber = req.body.billing.cardNumber || user.billing.cardNumber;
  //  user.billing.cardName = req.body.billing.cardName || user.billing.cardName;
  //  user.billing.cardExpirationMonth = req.body.billing.cardExpirationMonth || user.billing.cardExpirationMonth;
  //  user.billing.cardExpirationYear = req.body.billing.cardExpirationYear || user.billing.cardExpirationYear;

    user.save(function(err) {
      res.status(200).end();
    });
  });
};
/*
 |--------------------------------------------------------------------------
 | Log in with Email
 |--------------------------------------------------------------------------
 */
exports.login = function(req, res) {
  User.findOne({ email: req.body.email }, '+password', function(err, user) {
    if (!user) {
      return res.status(401).send({ message: 'Wrong email and/or password' });
    }
    user.comparePassword(req.body.password, function(err, isMatch) {
      if (!isMatch) {
        return res.status(401).send({ message: 'Wrong email and/or password' });
      }
      res.send({ token: createJWT(user) });
    });
  });
};

/*
 |--------------------------------------------------------------------------
 | Create Email and Password Account
 |--------------------------------------------------------------------------
 */
exports.signup = function(req, res) {
  User.findOne({ email: req.body.email }, function(err, existingUser) {
    if (existingUser) {
      return res.status(409).send({ message: 'Email is already taken' });
    }
    var user = new User({
      displayName: req.body.displayName,
      email: req.body.email,
      password: req.body.password
    });
    user.save(function() {
      res.send({ token: createJWT(user) });
    });
  });
};

/*
 |--------------------------------------------------------------------------
 | Login with Google
 |--------------------------------------------------------------------------
 */
exports.google = function(req, res) {
  var accessTokenUrl = 'https://accounts.google.com/o/oauth2/token';
  var peopleApiUrl = 'https://www.googleapis.com/plus/v1/people/me/openIdConnect';
  var params = {
    code: req.body.code,
    client_id: req.body.clientId,
    client_secret: config.GOOGLE_SECRET,
    redirect_uri: req.body.redirectUri,
    grant_type: 'authorization_code'
  };

  // Step 1. Exchange authorization code for access token.
  request.post(accessTokenUrl, { json: true, form: params }, function(err, response, token) {
    var accessToken = token.access_token;
    var headers = { Authorization: 'Bearer ' + accessToken };

    // Step 2. Retrieve profile information about the current user.
    request.get({ url: peopleApiUrl, headers: headers, json: true }, function(err, response, profile) {
      if (profile.error) {
        return res.status(500).send({message: profile.error.message});
      }
      // Step 3a. Link user accounts.
      if (req.headers.authorization) {
        User.findOne({ google: profile.sub }, function(err, existingUser) {
          if (existingUser) {
            return res.status(409).send({ message: 'There is already a Google account that belongs to you' });
          }
          var token = req.headers.authorization.split(' ')[1];
          var payload = jwt.decode(token, config.TOKEN_SECRET);
          User.findById(payload.sub, function(err, user) {
            if (!user) {
              return res.status(400).send({ message: 'User not found' });
            }
            user.google = profile.sub;
            user.picture = user.picture || profile.picture.replace('sz=50', 'sz=200');
            user.displayName = user.displayName || profile.name;
            user.save(function() {
              var token = createJWT(user);
              res.send({ token: token });
            });
          });
        });
      } else {
        // Step 3b. Create a new user account or return an existing one.
        User.findOne({ google: profile.sub }, function(err, existingUser) {
          if (existingUser) {
            return res.send({ token: createJWT(existingUser) });
          }
          var user = new User();
          user.google = profile.sub;
          user.picture = profile.picture.replace('sz=50', 'sz=200');
          user.displayName = profile.name;
          user.save(function(err) {
            var token = createJWT(user);
            res.send({ token: token });
          });
        });
      }
    });
  });
};

/*
 |--------------------------------------------------------------------------
 | Login with Facebook
 |--------------------------------------------------------------------------
 */
exports.facebook = function(req, res) {
  var fields = ['id', 'email', 'first_name', 'last_name', 'link', 'name'];
  var accessTokenUrl = 'https://graph.facebook.com/v2.5/oauth/access_token';
  var graphApiUrl = 'https://graph.facebook.com/v2.5/me?fields=' + fields.join(',');
  var params = {
    code: req.body.code,
    client_id: req.body.clientId,
    client_secret: config.FACEBOOK_SECRET,
    redirect_uri: req.body.redirectUri
  };

  // Step 1. Exchange authorization code for access token.
  request.get({ url: accessTokenUrl, qs: params, json: true }, function(err, response, accessToken) {
    if (response.statusCode !== 200) {
      return res.status(500).send({ message: accessToken.error.message });
    }

    // Step 2. Retrieve profile information about the current user.
    request.get({ url: graphApiUrl, qs: accessToken, json: true }, function(err, response, profile) {
      if (response.statusCode !== 200) {
        return res.status(500).send({ message: profile.error.message });
      }
      console.log(profile);
      if (req.headers.authorization) {
        User.findOne({ facebook: profile.id }, function(err, existingUser) {
          if (existingUser) {
            return res.status(409).send({ message: 'There is already a Facebook account that belongs to you' });
          }
          var token = req.headers.authorization.split(' ')[1];
          var payload = jwt.decode(token, config.TOKEN_SECRET);
          User.findById(payload.sub, function(err, user) {
            if (!user) {
              return res.status(400).send({ message: 'User not found' });
            }
            user.facebook = profile.id;
            user.picture = user.picture || 'https://graph.facebook.com/v2.3/' + profile.id + '/picture?type=large';
            user.displayName = user.displayName || profile.name;
            user.save(function() {
              var token = createJWT(user);
              res.send({ token: token });
            });
          });
        });
      } else {
        // Step 3b. Create a new user account or return an existing one.
        User.findOne({ facebook: profile.id }, function(err, existingUser) {
          if (existingUser) {
            var token = createJWT(existingUser);
            return res.send({ token: token });
          }
          var user = new User();
          user.facebook = profile.id;
          user.picture = 'https://graph.facebook.com/' + profile.id + '/picture?type=large';
          user.displayName = profile.name;
          user.save(function() {
            var token = createJWT(user);
            res.send({ token: token });
          });
        });
      }
    });
  });
};


/*
 |--------------------------------------------------------------------------
 | Unlink Provider
 |--------------------------------------------------------------------------
 */
exports.unlink = function(req, res) {
  var provider = req.body.provider;
  var providers = ['facebook', 'foursquare', 'google', 'github', 'instagram',
    'linkedin', 'live', 'twitter', 'twitch', 'yahoo'];

  if (providers.indexOf(provider) === -1) {
    return res.status(400).send({ message: 'Unknown OAuth Provider' });
  }

  User.findById(req.user, function(err, user) {
    if (!user) {
      return res.status(400).send({ message: 'User Not Found' });
    }
    user[provider] = undefined;
    user.save(function() {
      res.status(200).end();
    });
  });
};
