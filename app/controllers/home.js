var express = require('express'),
  router = express.Router();

module.exports = function (app) {
  app.use('/', router);
};

router.get('/', function (req, res, next) {

	require('./config/accelerator')(function(pPos){
		console.log(pPos);
	});

    res.render('index');

});
