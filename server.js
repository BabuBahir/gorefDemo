	const mongoose = require("mongoose");
	const express = require("express");
	const bodyParser = require('body-parser'); 
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

	// Set EJS as templating engine 
	// Require static assets from public folder
	app.use(express.static(path.join(__dirname, 'public')));

	// Set 'views' directory for any views 
	// being rendered res.render()
	app.set('views', path.join(__dirname, 'views'));

	// Set view engine as EJS
	app.engine('html', require('ejs').renderFile);
	app.set('view engine', 'html');


	router.route("/").get(function(req, res) {	  
		  //res.sendFile(path.join(__dirname + '/index.html'));
		  res.render('index', {name:'raja bhaiye'});   // for ejs
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
		  }
		});
	});

	router.route("/updatedata/:id").post(function(req, res) {
		var body  =req.body;	 	
		var id = req.params.id;  ;//body["id"]
		var data = { name: body["fullName"] ,location: body["location"] };	  
		
		employees.updateOne({"_id": id}, data, {upsert: false}, function(err, result) {				
			  if (err) {
				res.send(err);
			  } else {
				  console.log(result);
				  res.redirect("/list"); 		   					 
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


	router.route("/edit/:id").get(function(req, res) { 
		var id=req.params.id;  			 
		employees.findOne({_id: id}, function (err, doc) { 
			if (err){ 
				console.log(err); 
			} 
			else{ 			 
				console.log(doc);
				res.render('edit', {name: doc['name'] , id : doc['id'],location :doc['location'] }); 
			}		 
		});			 
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














