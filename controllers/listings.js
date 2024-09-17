const Listing=require("../models/listing");

module.exports.index=async (req,res)=>{
    let allListings=await Listing.find();
    // console.log(allListings);
    res.render("listings/index.ejs",{allListings});
};

module.exports.renderNewForm=(req,res)=>{
    // console.log(req.user);
    res.render("listings/new.ejs");
};

module.exports.showListing=async (req,res)=>{
    let {id}=req.params;
    let listing=await Listing.findById(id).populate({path:"reviews",populate:{
        path:"author"
    }}).populate("owner");
    if(!listing){
        req.flash("error","Listing you are looking for might be deleted or doesn't exist");
        res.redirect("/listings");
    }
    console.log(listing);
    res.render("listings/show.ejs",{listing});
};

module.exports.createListing=async (req,res,next)=>{
    let url=req.file.path;
    let filename=req.file.filename;
    // console.log(filename);
    // console.log(url);

    // let data=req.body.listing;
    // console.log(data);
    // if(!req.body.listing){
    //     throw new ExpressError(400,"Send valid Data for listing");
    // }
    let newListing=new Listing(req.body.listing);
    // if(!newListing.title){
    //     throw new ExpressError(400,"title is missing");
    // }
    // if(!newListing.description){
    //     throw new ExpressError(400,"Description is mssing");
    // }
    //Instead of above server side validation we use joi package.
    // let result=listingSchema.validate(req.body);
    // console.log(result.error.message);
    // if(result.error){
    //     throw new ExpressError(400,result.error);
    // }

    ///Storing the current loggedin owner
    newListing.owner=req.user._id;
    
    //saving the image url and filename
    newListing.image={url,filename}
    await newListing.save();
    req.flash("success","New Listing added!");
    res.redirect("/listings");
};

module.exports.editListing=async (req,res)=>{
    let {id}=req.params;
    let listing=await Listing.findById(id);
    if(!listing){
        req.flash("error","Listing you are looking for might be deleted or doesn't exist");
        res.redirect("/listings");
    }
    let originalImageUrl=listing.image.url;
    originalImageUrl=originalImageUrl.replace("/upload","/upload/w_300");
    res.render("listings/edit.ejs",{listing,originalImageUrl});
};

module.exports.updateListing=async (req,res)=>{
    let {id}=req.params;
    // if(!req.body.listing){
    //     throw new ExpressError(400,"Send Valid data for listing object");
    // }
    const listing=await Listing.findByIdAndUpdate(id,{...req.body.listing});

    //if user uploads a file(i.e image)
    if(typeof req.file !== "undefined"){
        let url=req.file.path;
        let filename=req.file.filename;
        listing.image={url,filename};
        await listing.save();
    }

    req.flash("success","Listing Updated!");
    res.redirect(`/listings/${id}`);
};

module.exports.destroyListing=async (req,res)=>{
    let {id}=req.params;
    let deletedListing=await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("failure","Listing is Deleted!");
    res.redirect("/listings");
};