var mongoose      = require('mongoose');
var multer        = require('multer');


var vendorSchema = new mongoose.Schema({
  vendorName         : String,
  vendorType       : String
});


var Vendor = mongoose.model('Vendor', vendorSchema);

//example
//{ "vendorName" : "anjappar",
//"vendorType": "chettinaud"
//}
exports.createVendor = function(req, res) {
    var vendor = new Vendor({
      vendorName: req.body.vendorName,
      vendorType: req.body.vendorType
    });
    vendor.save(function() {
      res.status(200).send({ message: 'Vendor created successfully' });
    });

};

exports.getAllVendors = function(req, res, next) {
  Vendor.find(function(err, vendors) {
    res.send(vendors);
  });
};

exports.getVendor = function(req, res, next) {
  Vendor.findById(req.params.id, function(err, vendor) {
    res.send(vendor);
  });
};

exports.updateVendor =  function(req, res) {
  Vendor.findById(req.params.id, function(err, vendor) {
    if (!vendor) {
      return res.status(400).send({ message: 'Vendor not found' });
    }
    vendor.vendorName = req.body.vendorName || vendor.vendorName;
    vendor.vendorType = req.body.vendorType || vendor.vendorType;

    vendor.save(function(err) {
      res.status(200).send({ message: 'Vendor updated successfully' });
    });
  });
};

  var storage = multer.diskStorage({ //multers disk storage settings
         destination: function (req, file, cb) {
             cb(null, 'C:/temp/uploads/')
         },
         filename: function (req, file, cb) {
             var datetimestamp = Date.now();
             cb(null, file.fieldname + '-' + datetimestamp + '.' + file.originalname.split('.')[file.originalname.split('.').length -1])
         }
     });

   var upload = multer({ //multer settings
                   storage: storage
               }).single('file');

exports.uploadVendor = function(req, res) {
  Vendor.findById(req.params.id, function(err, vendor) {
    if (!vendor) {
      return res.status(400).send({ message: 'Vendor not found' });
    }

    console.log("uploadVendor method"+ req.file);
    upload(req,res,function(err){
             if(err){
                  res.json({error_code:1,err_desc:err});
                  return;
             }
              res.json({error_code:0,err_desc:null});
              console.log("Stored file name" + storage.filename);
         });

    vendor.save(function(err) {
      res.status(200).send({ message: 'Vendor updated successfully' });
    });
  });
};

exports.deleteVendor =  function(req, res) {
  Vendor.findById(req.params.id, function(err, vendor) {
    if (!vendor) {
      return res.status(400).send({ message: 'Vendor not found' });
    }

    vendor.remove(function(err) {
      if (err) return res.status(400).send({ message: err });
      res.status(200).send({ message: 'Vendor deleted successfully' });
    });
  });
};
