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
    providerNum:Number,
    firstName: String,
    lastName: String,
    foodType:String,
    phone:String,
    addr:String,
    menu:String,
    lat:Number,
    lon:Number,
    averageUserRating:Number,
    createdTime : { type : Date, default: Date.now },
    lastUpdatedTime : { type : Date, default: Date.now }
});

let sModel = mongoose.model('VendorList', ServiceProviderSchema);
app.use('/', express.static(process.cwd() + '/public'));
app.get('/get-vendors/:filter', function(req, res) {
console.log("Filtering "+req.params.filter+" is not real refined yet.");
   let filter = req.params.filter;
//    if (filter == "veggie")
    var q = sModel.find({"foodType":filter}, {
        _id: 0,
        __v: 0
    });
    q.exec(function(err, data) {
        if (err) console.log("please send a mail to manley@stanford.org, he will be interested in the error..");
        res.end(JSON.stringify(data));
    });
});


//https://garnysh-manley1971.c9users.io/add-vendor/pmvp?firstName=David&lastName=Manley&foodType=veggie&lat=37.6719&lon=-121.7681&phone=4216265&addr=214Tourmaline&menu=SetMenu1
app.get('/add-vendor/:str', function(req, res) {
    let str = req.params.str;
    let fields = str.split("?");
    let newVendor = new sModel({
        providerNum: req.query.providerNum,
        firstName: req.query.firstName,
        lastName: req.query.lastName,
        foodType: req.query.foodType,
        phone: req.query.phone,
        addr: req.query.addr,
        menu: req.query.menu,

        lat: req.query.lat,
        lon: req.query.lon,
    });
    console.log("Save record for"+req.query.firstName);
    newVendor.save();

    let retval = { "entered:":fields[0] };
    res.send(JSON.stringify(retval));
});

//just get everything if no filter
app.get('/get-vendors', function(req, res) {
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


var port = process.env.PORT || 8080;
app.listen(port,  function () {
	console.log('Node.js listening on port ' + port + '...');
});
