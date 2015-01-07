var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// a databse validation function
var nameValidation = function(val) {
	console.log("inside name validation");
	console.log(val);
	
	if (val=="") return false; // if it's an empty string, return false
	else return true; 
}

var foodSchema = new Schema({
	slug : { type: String, lowercase: true, required: true, unique: true },
	name : { type: String, required: true, validate: [nameValidation, 'Name cannot be blank.']},
	upvotes: {type: Number, default: 0},
	photo: String,
	recommendedBy: String,
	dateAdded : { type: Date, default: Date.now },
})

// export 'Food' model so we can interact with it in other files
module.exports = mongoose.model('Food',foodSchema);