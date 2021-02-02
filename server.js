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
				  res.redirect("/list"); 		   
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


		router.route("/find/:id").get(function(req, res) {
			
				// var name="pap"; 
				// employees.find({name: {$regex: name, $options: 'i'}}, function (err, doc) { 
					// if (err){ 
						// console.log(err); 
					// } 
					// else{ 
						// console.log("Second function call : ", doc); 
						// res.send(docs);
					// } 
				// }); 
				
				var id=req.params.id;  
				employees.findOne({_id: id}, function (err, doc) { 
				if (err){ 
					console.log(err); 
				} 
				else{ 			 
					res.send(doc);
				}
			 
			});
		});	


		router.route("/edit/:id").get(function(req, res) { 
				var id=req.params.id;  
				res.sendFile(path.join(__dirname + '/edit.html'	)); 
		});

		router.route("/delete/:id").get(function(req, res) {
			
				var id=req.params.id;  
				employees.findOne({_id: id}, function (err, doc) { 
				if (err){ 
					console.log(err); 
				} 
				else{ 						 
					doc.remove();    // to delete
					res.redirect("/list"); 
				} 
			});  
		});














