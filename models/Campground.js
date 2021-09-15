const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CampgroundSchema = new Schema({
	title: String,
	price: String,
	description: String,
	location: String,
});

// compile model ("class") and export it.
module.exports = mongoose.model("Campground", CampgroundSchema);
