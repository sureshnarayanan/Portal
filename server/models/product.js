var mongoose = require('mongoose');

var productSchema = new mongoose.Schema({
  name      : String,
  price     : Number
});

var Product = mongoose.model('Product', productSchema);

exports.createProduct = function(req, res){
  var newProduct = new Product({
    name : req.body.productName,
    price : req.body.productPrice
  });
  newProduct.save(function(){
    res.status(200).send({message:"Product created successfully!"});
  });
};

  exports.getAllProducts = function(req, res, next){
    Product.find(function(err, products){
      //if (err){return res.status(400).send({message:'Error to get Products: '+ err})}
      res.send(products);
    });
  };
