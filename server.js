//of course this garnysh code is demo only
'use strict';

var express = require('express');
var routes = require('./app/routes/index.js');
var mongoose = require('mongoose');
var session = require('express-session');

var app = express();
require('dotenv').load();

mongoose.connect(process.env.MONGO_URI,function (err){if (err) console.log("error in connecting to mongo")});
console.log(process.env.MONGO_URI);

var ServiceProviderSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    foodType:String,
    phone:String,
    addr:String,
    menu:String,
//    lat:Double,
  //  lon:Double,
    //averageUserRating:Double,
//    created:Timestamp,
  //  lastupdated:Timestamp
});

let sModel = mongoose.model('VendorList', ServiceProviderSchema);


app.use('/controllers', express.static(process.cwd() + '/app/controllers'));
app.use('/', express.static(process.cwd() + '/public'));
app.use('/common', express.static(process.cwd() + '/app/common'));


app.get('/get-vendors/:filter', function(req, res) {
   let filter = req.params.filter;
 
    let q = sModel.find({}, {
        _id: 0,
        __v: 0
    });
    q.exec(function(err, data) {
        if (err) console.log("please send a mail to manley@stanford.org, he will be interested in the error..");
        res.end(JSON.stringify(data));
    });
});



app.get('/add-vendor/:str', function(req, res) {
    let str = req.params.str;
    let fields = str.split("?");
    let newVendor = new sModel({
        firstName: fields[0],
    });
    console.log("Save this vendor");
    newVendor.save();

    let retval = { "status:":fields[0] };
    res.send(JSON.stringify(retval));
});

var port = process.env.PORT || 8080;
app.listen(port,  function () {
	console.log('Node.js listening on port ' + port + '...');
});
