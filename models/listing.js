const mongoose=require("mongoose");
const Schema=mongoose.Schema;
const Review=require("./review.js");

const listingSchema=new Schema({
    title:{
        type:String,
        required:true
    },
    description:{
        type:String,
    },
    image:{
        url:String,
        filename:String
        // type:String,
        // default:"https://media.istockphoto.com/id/1297349747/photo/hot-air-balloons-flying-over-the-botan-canyon-in-turkey.jpg?s=1024x1024&w=is&k=20&c=U-1aMueiJ5vYIMY-2JTwaSLOXTnoSkAzCVLk1hE6wfE=",
        // // It sets the if user does not provide the image url then it is used.
        // set:(v)=> v===""?
        // "https://media.istockphoto.com/id/1297349747/photo/hot-air-balloons-flying-over-the-botan-canyon-in-turkey.jpg?s=1024x1024&w=is&k=20&c=U-1aMueiJ5vYIMY-2JTwaSLOXTnoSkAzCVLk1hE6wfE="
        // : v
    },
    price:{
        type:Number,
    },
    location:{
        type:String,
    },
    country:{
        type:String
    },
    reviews: [
        {
            type:Schema.Types.ObjectId,
            ref:"Review"
        }
    ],
    owner:{
        type:Schema.Types.ObjectId,
        ref:"User"
    }  
});

//middleware to handle delete listing.
//It triggered when ever an listing is deleted.
listingSchema.post("findOneAndDelete", async(listing)=>{
    if(listing){
        await Review.deleteMany({_id:{$in:listing.reviews}});
    }
})

const Listing=mongoose.model("Listing",listingSchema);
module.exports=Listing;