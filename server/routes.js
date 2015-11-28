var auth = require('../server/models/auth');
var vendor = require('../server/models/vendor');
var product = require('../server/models/product');
var user = require('../server/models/user');

module.exports = function(app) {

	// server routes ===========================================================
	// handle things like api calls

	//User Authentication routes
	app.get('/api/me', auth.isAuthenticated, auth.getUserProfile);
	app.put('/api/me', auth.isAuthenticated, auth.updateUserProfile);
	app.post('/auth/login', auth.login);
	app.post('/auth/signup', auth.signup);
	app.post('/auth/google', auth.google);
	app.post('/auth/facebook', auth.facebook);
	app.post('/auth/unlink', auth.isAuthenticated, auth.unlink);
	//Vendor Routes
	app.post('/api/vendors', vendor.createVendor);
	app.get('/api/vendors', vendor.getAllVendors);
	app.get('/api/vendors/:id', vendor.getVendor);
	app.put('/api/vendors/:id', vendor.updateVendor);
	app.delete('/api/vendors/:id', vendor.deleteVendor);
	//User Routes
	app.get('/api/useraccounts', user.getAllUsers);
	app.get('/api/useraccounts/:id', user.getUser);

	//Product Routes
	app.post('/api/products', product.createProduct);
	app.get('/api/products', product.getAllProducts);
	app.get('/api/products/:id', product.getProduct);
	app.put('/api/products/:id', product.updateProduct);
	app.delete('/api/products/:id', product.deleteProduct);

	// frontend routes =========================================================
	// route to handle all angular requests
	app.get('*', function(req, res) {
		res.sendfile('./client/app/index.html');
	});

};
