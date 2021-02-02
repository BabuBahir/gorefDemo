const mongoose = require("mongoose");
const express = require("express");
var bodyParser = require('body-parser'); 
const app = express();
const employees = require("./model");
const router = express.Router();
const path = require('path');
const port = 4000;

var uri = "mongodb://localhost:27017/demo";

mongoose.connect(uri, { useUnifiedTopology: true, useNewUrlParser: true });

const connection = mongoose.connection;

connection.once("open", function() {
  console.log("MongoDB database connection established successfully");
});

// configure the app to use bodyParser()
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
app.use("/", router);
 

app.listen(port, function() {
  console.log("Server is running on Port: " + port);
});



router.route("/").get(function(req, res) {	  
	  res.sendFile(path.join(__dirname + '/index.html'));
});

router.route("/list").get(function(req, res) {	  
	  res.sendFile(path.join(__dirname + '/list.html'));
}); 
 
router.route("/insertdata").post(function(req, res) {
	var body  =req.body;	 	
	
	var data = [{ name: body["fullName"] ,location: body["location"] }];	 
	 
	employees.insertMany(data, function(err, result) {
	  if (err) {
		res.send(err);
	  } else {
		  res.sendFile(path.join(__dirname + '/list.html'));
		//res.send(result);
	  }
	});
});


router.route("/fetchdata").get(function(req, res) {
  employees.find({}, function(err, result) {
    if (err) {
      res.send(err);
    } else {
      res.send(result);
    }
  });
});


router.route("/find").get(function(req, res) {
	
	var name="pap"; 
	employees.find({name: {$regex: name, $options: 'i'}}, function (err, docs) { 
    if (err){ 
        console.log(err); 
    } 
    else{ 
        console.log("Second function call : ", docs); 
		res.send(docs);
    } 
}); 
 
});




