const Listing = require ("../models/listing.js");
const {listingSchema}=require("../schema.js");
const mbxGeoCoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeoCoding({ accessToken: mapToken });


module.exports.index = async(req,res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs",{allListings});
   };

module.exports.renderNewForm = (req,res) => {
  res.render("listings/new.ejs");
};

module.exports.showListings = async(req,res) => {
    let {id} = req.params;
    const partiList = await Listing.findById(id).populate({path : "review",populate:{path:"author",},}).populate("owner");
    if(!partiList){
      req.flash("error","Listing you requested  for does not exist!");
      res.redirect("/listings");
    }
    res.render("listings/show.ejs",{partiList});

};

module.exports.createNewListing = async(req,res,next) =>{
  let response = await geocodingClient.forwardGeocode({
    query: req.body.listing.location,
    limit: 1,
  }).send()
    
  let url = req.file.path;
  let filename = req.file.filename;
  let result = listingSchema.validate(req.body);
  if(result.error){
    throw new ExpressError(400,result.error);
  }
  const newList = new Listing(req.body.listing);
  newList.owner = req.user._id;
  newList.image = {url,filename};
  newList.geometry = response.body.features[0].geometry;
  let savedListing = await newList.save();
  console.log("Listing Saved With Coordinates");
  req.flash("success","New Listing Created!");
  res.redirect("/listings")
};

module.exports.editListing = async(req,res) =>{
  let {id} = req.params;
  const partiList = await Listing.findById(id);
  if(!partiList){
    req.flash("error","Listing you requested  for does not exist!");
    res.redirect("/listings");
  }
  res.render("listings/edit.ejs",{partiList});
};

module.exports.updateListing = async(req,res) => {
  let {id} = req.params;
  let listing = await Listing.findByIdAndUpdate(id,{...req.body.listing});

  if(typeof req.file !== "undefined"){
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image = {url,filename};
    await listing.save();
  }

  req.flash("success","Listing Updated");
  res.redirect(`/listings/${id}`);
};

module.exports.deleteListing = async(req,res) => {
    let {id} = req.params;
    let deletedList = await Listing.findByIdAndDelete(id); 
    console.log(deletedList);
    req.flash("success","Listing Deleted");
    res.redirect("/listings"); 
  
};