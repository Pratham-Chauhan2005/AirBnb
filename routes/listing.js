const express = require("express");
const router =  express.Router();
const wrapAsync=require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const {isLoggedIn,isOwner,validateListing}=require("../middleware.js");
const {listingSchema}=require("../schema.js");
const listingController = require("../controllers/listings.js");
const multer = require("multer");
const {storage} = require("../cloudConfig.js");
const upload = multer({ storage});    


// index Route and create
router
.route("/")
.get(wrapAsync(listingController.index))
.post(isLoggedIn , upload.single("listing[image]") ,validateListing  ,wrapAsync(listingController.createNewListing));


// New route 
router.get("/new",isLoggedIn, listingController.renderNewForm);

// Show route and update and delete
router
.route("/:id")
.get( wrapAsync(listingController.showListings))
.put( isLoggedIn , isOwner , upload.single("listing[image]") , validateListing ,wrapAsync(listingController.updateListing))
.delete(isLoggedIn, isOwner  ,wrapAsync(listingController.deleteListing));

// edit Route 
router.get("/:id/edit",isLoggedIn, isOwner ,wrapAsync(listingController.editListing));

module.exports=router;

