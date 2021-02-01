const mongoose = require("mongoose");
const express = require("express");
const app = express();
const employees = require("./model");
const router = express.Router();
const port = 4000;

var uri = "mongodb://localhost:27017/demo";

mongoose.connect(uri, { useUnifiedTopology: true, useNewUrlParser: true });

const connection = mongoose.connection;

connection.once("open", function() {
  console.log("MongoDB database connection established successfully");
});

app.use("/", router);

app.listen(port, function() {
  console.log("Server is running on Port: " + port);
});


	
	var data = [
	  {
		name: "John",
		location: "New York"
	  },
	  {
		name: "Smith",	
		location: "Texas"
	  },
	  {
		name: "Lisa",		
		location: "Chicago"
	  }
	];


 
router.route("/insertdata").post(function(req, res) {
	employees.insertMany(data, function(err, result) {
	  if (err) {
		res.send(err);
	  } else {
		res.send(result);
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