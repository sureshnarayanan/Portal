var mongoose = require('mongoose');

var productSchema = new mongoose.Schema({
  productname      : String,
  productprice     : Number,
  productdescription : String,
  productcategory : String/*,
  img : {
    data : Buffer,
    contentType : String
  }*/
});

var ProductDbModel = mongoose.model('Product', productSchema);

/*
Creates a new Product.
Test from postman:
Method: POST
Url: http://localhost:8080/api/products
Header: Content-Type = application/json
Body:
{
"productproductname" : "MyProduct",
"productPrice" : 25,
"productDescription" : "More info on my product",
"productCategory" : "food"
}
*/
exports.createProduct = function(req, res){
  var newProduct = new ProductDbModel();
  setProductDetails(newProduct, req);
  newProduct.save(function(){
    res.status(200).send({message:"Product created successfully!"});
  });
};

  /*
  Gets all the products.
  Test from postman:
  Method: GET
  Url: http://localhost:8080/api/products
  */
  exports.getAllProducts = function(req, res, next){
    ProductDbModel.find(function(err, products){
      if (err){return res.status(400).send({message:'Error to get Products: '+ err})}
      res.send(products);
    });
  };

  /*
  Get a  product with id.
  Test from postman:
  Method: GET
  Url: http://localhost:8080/api/products/:id
  Params: id : id_value
  Body:
  {
  "productName" : "MyProduct",
  "productPrice" : 25,
  "productDescription" : "More info on my product",
  "productCategory" : "food"
  }
  */
  exports.getProduct = function(req, res){
    ProductDbModel.findById(req.params.id, function(err, product){
      if (!product){
        res.status(400).send({message:'Product not found\n' + err})
      }
      res.send(product);
    });
  };

  /*
  Update a  product with id.
  Test from postman:
  Method: PUT
  Url: http://localhost:8080/api/products/:id
  Params: id : id_value
  */
  exports.updateProduct = function(req, res){
    ProductDbModel.findById(req.params.id, function(err, product){
      if (!product){
        res.status(400).send({message:'Product not found\n' + err})
      }
      setProductDetails(product, req);
      product.save(function(){
        res.status(200).send({message:"Product updated successfully!"});
      });
    });
  };

  var setProductDetails = function(product, req){
    if (req.body.productName)
      product.productname = req.body.productName;
    if (req.body.productPrice)
      product.productprice = req.body.productPrice;
    if (req.body.productDescription)
      product.productdescription = req.body.productDescription;
    if (req.body.productCategory)
      product.productcategory = req.body.productCategory;
    /*if (req.body.productimg){
      //console.error("Image:" +  req.body.productImage);
      product.img.data = req.body.productImage;
      product.img.contentType = "image/png";
    }*/
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
