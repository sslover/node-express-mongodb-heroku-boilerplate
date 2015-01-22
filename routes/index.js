
/*
 * routes/index.js
 * 
 * Routes contains the functions (callbacks) associated with request urls.
 */

var Food = require("../models/model.js"); //our db model

/*
	GET /
*/

// home page route to show all suggested foods
exports.index = function(req, res) {
	
	console.log("main page requested");

	// we want to show all the foods that are already in the database

	// query for all foods
	// .find will accept 4 arguments
	//  see http://mongoosejs.com/docs/api.html#model_Model.find
	// 1) an object for filtering {} (empty here)
	// 2) a string of properties to return, 'name slug upvotes photo recommendedB' will return only those attributes of the model
	// 3) an object for sorting {sort:'-upvotes'}, the most upvoted will come first
	// 4) callback function with (err, data)
	//    err will include any error that occurred
	//	  data is our resulting array of food objects returned from the database
	Food.find({}, 'name slug upvotes photo recommendedBy',{sort:'-upvotes'}, function(err, data){

		if (err) {
			console.log(err);
			res.send("Unable to query database for food").status(500);
		};

		console.log("retrieved " + data.length + " food products from database");

		//build and render the template data object, which we will pass into the page
		var templateData = {
			food : data,
			pageTitle : "ITP Snacks! (" + data.length + " Food Products)"
		}

		res.render('index.html', templateData);

	});

}

/*
	GET /api/food
*/

// api route to return all food as JSON
exports.allFoodApi = function(req, res) {

	// this is another way of doing a db query, which is identical to the above
	foodQuery = Food.find({}); // query for all food with no filters
	foodQuery.sort('-upvotes'); // sort by upvotes
	
	// display only these fields from food data
	foodQuery.select('name slug upvotes photo recommendedBy');
	
	foodQuery.exec(function(err, data){

		// prepare data for JSON
		var jsonData = {
			status : 'OK',
			food : data
		}

		res.json(jsonData);
	});

}

/*
	GET /food/:slug
*/

// get a single food item and display it to user
exports.oneFood = function(req, res) {

	console.log("detail page requested for food with slug " + req.params.slug);

	//get the requested food item by the param on the url /food/:slug
	var requestedSlug = req.params.slug;

	// query the database for that food with findOne, searching by its slug
	// see http://mongoosejs.com/docs/api.html#model_Model.findOne
	Food.findOne({slug:requestedSlug},function(err, data){

		if (err) {
			console.log(err);
			return res.status(500).send("There was an error on the food query");
		}

		if (data == null) {
			console.log("couldn't find that food!")
			return res.status(404).render('404.html');
		}

		console.log("Found the matching food item! --> " + data.name);

			//prepare template data to pass into the view
			var templateData = {
				food : data,
				pageTitle : data.name
			}

			// render and return the template
			res.render('detail.html', templateData);				
		
	}); // end of .findOne query

}

/*
	GET api/food/:slug
*/

// get a single food item and return it in json
// same as above only responds in json

exports.oneFoodApi = function(req, res) {

	console.log("detail page requested for food with slug " + req.params.slug);

	//get the requested food item by the param on the url /food/:slug
	var requestedSlug = req.params.slug;

	// query the database for that food with findOne, searching by its slug
	// see http://mongoosejs.com/docs/api.html#model_Model.findOne
	Food.findOne({slug:requestedSlug},function(err, data){

		if (err) {
			console.log(err);
			return res.status(500).send("There was an error on the food query");
		}

		if (data == null) {
			console.log("couldn't find that food!")
			return res.status(404).render('404.html');
		}

		console.log("Found the matching food item! --> " + data.name);

			//prepare template data to pass into the view
			var jsonData = {
				food : data,
				status : 'OK'
			}

			// return the JSON
			res.json(jsonData);			
		
	}); // end of .findOne query

}

/*
	GET /add
*/

// serves up the add product form
exports.addFoodForm = function(req, res){

	var templateData = {
		pageTitle : 'Suggest a Product!'
	};

	res.render('create_form.html', templateData);
}

/*
	POST /add
*/

// saves a new product to the database from the POST request
exports.addFoodToDb = function(req, res) {
	
	console.log("received form submission");
	console.log(req.body); // data to save

	// accept form post data
	// make it into an object we'll save
	var foodToSave = new Food({
		name: req.body.name,
		photo: req.body.photo,
		recommendedBy: req.body.recommendedBy,
		slug : req.body.name.toLowerCase().replace(/[^\w ]+/g,'').replace(/ +/g,'_') 
		// the above nifty function takes the name and makes a slug out of it like 
		// hello-this-is-the-name
	});
	
	// save the food to the database
	foodToSave.save(function(err,data){
		if (err) {
			// if there's an error on saving (perhaps a validation error?)
			console.log("Error on saving the food");
			console.log(err); // log out to Terminal all errors

			var templateData = {
				pageTitle : 'Suggest a Product!',
				errors : err.errors, 
				food : req.body
			};

			// re-render the create page, but pass in the templateData
			// this means the user will see the form with the data they already entered
			res.render('create_form.html', templateData);

		} else {
			console.log("Created a new food!");
			console.log(data);
			
			// redirect to this new food's page
			res.redirect('/food/'+ data.slug);
		}
	});
};

/*
	POST /food/:slug/edit
*/

//prepares and populates the form to edit a food
exports.editFoodForm = function(req, res) {

	// Get food by its slug in /food/:slug/edit
	var requestedSlug = req.params.slug;

	// query the database for that food with findOne, searching by its slug
	// see http://mongoosejs.com/docs/api.html#model_Model.findOne	
	Food.findOne({slug:requestedSlug},function(err, data){

		if (err) {
			console.error("ERROR");
			console.error(err);
			res.send("There was an error querying for "+ requestedSlug).status(500);
		}

		if (data == null) {
			console.log("couldn't find that food!")
			return res.status(404).render('404.html');
		}

		if (data != null) {

			// prepare template data
			var templateData = {
				pageTitle: "Edit "+data.name,
				food: data
			};

			// render the edit form, passing in the existing values so the user can see them
			res.render('edit_form.html',templateData);

		}

	}) // end .findOne

}

/*
	POST /food/:slug/edit
*/

//takes the data from the POST request and updates the food
exports.updateFoodToDb = function(req, res) {

	// Get food by its slug in /food/:slug/edit
	var requestedSlug = req.params.slug;

	// accept form post data
	// make it into an object we'll save
	var updatedData = {
		name: req.body.name,
		photo: req.body.photo,
		recommendedBy: req.body.recommendedBy,
		slug : req.body.name.toLowerCase().replace(/[^\w ]+/g,'').replace(/ +/g,'_') 
		// the above nifty function takes the name and makes a slug out of it like 
		// hello-this-is-the-name
	}


	// query and update the requested food
	// see http://mongoosejs.com/docs/api.html#model_Model.update
	// $set updates the field if it exists, otherwise it adds it
	// http://docs.mongodb.org/manual/reference/operator/update/set/
	Food.update({slug:requestedSlug}, { $set: updatedData}, function(err, data){

		if (err) {
			console.error("ERROR: While updating");
			console.error(err);			
		}

		if (data != null) {
			// redirect to that updated food!
			res.redirect('/food/' + updatedData.slug);

		} else {

			// unable to find that food, return 404
			console.error("unable to find food: " + data.slug);
			return res.status(404).render('404.html');
		}
	})
}

/*
	GET /food/:slug/upvote
*/

// increments the upvote a given food
exports.incrementUpvote = function(req,res){

	// Get food by its slug in /food/:slug/upvote
	var requestedSlug = req.params.slug;

	// query the database for that food with findOne, searching by its slug
	// see http://mongoosejs.com/docs/api.html#model_Model.findOne	
	Food.findOne({slug:requestedSlug},function(err, data){

		if (err) {
			console.error("ERROR");
			console.error(err);
			res.send("There was an error querying for "+ requestedSlug).status(500);
		}

		if (data == null) {
			console.log("couldn't find that food!")
			return res.status(404).render('404.html');
		}

		if (data != null) {

			// now we will update this returned data
			var newUpvoteCount = data.upvotes + 1; // increment by 1
			Food.update({slug:requestedSlug},{upvotes:newUpvoteCount},function(err,response){

				if(err){
					console.log(err);
					return res.json({status:"ERROR"});
				}

				res.json(data); // respond back with JSON

			}) // end update

		}

	}) // end .findOne

}

/*
	GET /food/:slug/delete
*/

// deletes a food with a given slug
exports.deleteFood = function(req,res) {

	// Get food by its slug in /food/:slug/edit
	var requestedSlug = req.params.slug;
	
	// remove the requested food based on its requestedSlug
	// http://mongoosejs.com/docs/api.html#model_Model-remove
	Food.remove({slug:requestedSlug}, function(err){
		if (err){ 
			console.error(err);
			res.send("Error when trying to remove food: "+ requestedSlug);
		}

		res.send("Removed the food! <a href='/'>Back to home</a>.");
	});

};