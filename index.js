const express = require("express");
const app = express();
const path = require("path");

const mongoose = require("mongoose");

const Campground = require("./models/Campground");

const methodOverride = require("method-override");

mongoose.connect("mongodb://localhost:27017/yelp-camp", {
	useNewUrlParser: true,
	useCreateIndex: true,
	useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
	console.log("Database connected.");
});

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// allow us to get values set with a POST form method (i.e req.body)
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

app.get("/", (req, res) => {
	res.render("home");
});

// Displays ALL Campgrounds.
app.get("/campgrounds", async (req, res) => {
	const camps = await Campground.find({});
	res.render("campgrounds/index", { camps });
});

// Renders the page which users will use to create a new Campground.
app.get("/campgrounds/new", (req, res) => {
	res.render("campgrounds/new");
});

app.get("/campgrounds/:id/edit", async (req, res) => {
	const { id } = req.params;
	const camp = await Campground.findById(id);
	res.render("campgrounds/edit", { camp });
});

// Renders a details page of the Campground with the corresponding ID given.
app.get("/campgrounds/:id", async (req, res) => {
	const { id } = req.params;
	const camp = await Campground.findById(id);
	res.render("campgrounds/show", { camp });
});

// From the /campgrounds/new page, the user submits a form (Post) to add Campground to the database
// redirects user to details page
app.post("/campgrounds/new", async (req, res) => {
	const newCamp = new Campground(req.body.campground);
	console.log("New Campground: " + newCamp);
	await newCamp.save();
	res.redirect(`/campgrounds/${newCamp._id}`);
});

app.patch("/campgrounds/:id", async (req, res) => {
	const { id } = req.params;
	const updateCamp = await Campground.findOneAndUpdate(id, {
		...req.body.campground,
	});

	res.redirect(`/campgrounds/${updateCamp._id}`);
});

app.delete("/campgrounds/:id", async (req, res) => {
	const { id } = req.params;
	const deletedCamp = await Campground.findByIdAndDelete(id);
	console.log("Deleted camp: " + deletedCamp);
	res.redirect("/campgrounds");
});

app.listen(3000, () => {
	console.log("Listening on Port 3000");
});
