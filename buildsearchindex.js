var mongoose = require('mongoose');
var es = require('elasticsearch');
var client = new es.Client({
  host: 'localhost:9200'
});
var http = require('http');
process.env.NODE_ENV = process.env.NODE_ENV || 'development'; //set Environment

var config = require('./server/config/config');

mongoose.connect(config.db);
mongoose.connection.on('error', function(err) {
  console.log('Error: Could not connect to MongoDB. Did you forget to run `mongod`?'.red);
});

var productSchema = new mongoose.Schema({
  name      : String,
  description     : String
});
var Product = mongoose.model('Product', productSchema);

Product.find(function(err, products){
  //if (err){return res.status(400).send({message:'Error to get Products: '+ err})}
  console.log(products);
  var data = JSON.stringify({
  "text" :"everything is awesome"
});
  // An object of options to indicate where to post to
  var post_options = {
      host: 'localhost',
      port: '9200',
      path: '/products',
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(data)
      }
  };

  // Set up the request
  var post_req = http.request(post_options, function(res) {
      res.setEncoding('utf8');
      res.on('data', function (chunk) {
          console.log('Response: ' + chunk);
      });
  });

  // post the data
  post_req.write(data);
  post_req.end();
  console.log('Done!');
});
