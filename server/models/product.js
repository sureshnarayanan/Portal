var mongoose = require('mongoose');

var productSchema = new mongoose.Schema({
  name      : String,
  price     : Number
});

var ProductDbModel = mongoose.model('Product', productSchema);

exports.createProduct = function(req, res){
  var newProduct = new ProductDbModel({
    name : req.body.productName,
    price : req.body.productPrice
  });
  newProduct.save(function(){
    res.status(200).send({message:"Product created successfully!"});
  });
};

  exports.getAllProducts = function(req, res, next){
    ProductDbModel.find(function(err, products){
      if (err){return res.status(400).send({message:'Error to get Products: '+ err})}
      res.send(products);
    });
  };

  exports.getProduct = function(req, res){
    ProductDbModel.findById(req.params.id, function(err, product){
      if (!product){
        res.status(400).send({message:'Product not found' + err})
      }
      res.send(product);
    });
  };

  exports.updateProduct = function(req, res){
    ProductDbModel.findById(req.params.id, function(err, product){
      if (!product){
        res.status(400).send({message:'Product not found' + err})
      }
      setProductDetails(product, req);
      product.save(function(){
        res.status(200).send({message:"Product updated successfully!"});
      });
    });
  };

  var setProductDetails = function(product, req){
    product.name = req.body.productName;
    product.price = req.body.productPrice;
  }

  exports.deleteProduct =  function(req, res) {
    ProductDbModel.findById(req.params.id, function(err, product) {
      if (!product) {
        return res.status(400).send({ message: 'Product not found' });
      }

      product.remove(function(err) {
        if (err) return res.status(400).send({ message: err });
        res.status(200).send({ message: 'Product deleted successfully' });
      });
    });
  };
