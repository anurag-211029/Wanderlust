if(process.env.NODE_ENV!="production"){
    require('dotenv').config();
}
// console.log(process.env.SECRET);

const express=require("express");
const app=express();
const mongoose=require("mongoose");
const path=require("path");
const methodOverride=require("method-override");
const ejsMate=require("ejs-mate");
const session=require("express-session");
const MongoStore = require('connect-mongo');
const flash=require('connect-flash');
const passport=require("passport");
const LocalStrategy=require("passport-local");
const User=require("./models/user.js");


// let MONGO_URL="mongodb://127.0.0.1:27017/wanderlust";
let dburl=process.env.ATLASDB_URL;

//storing session info
const store=MongoStore.create({
    mongoUrl: dburl,
    crypto:{
        secret: process.env.SECRET
    },
    touchAfter:24*3600
});

//discovering the error in mongo store
store.on("error",()=>{
    console.log("Error in Mongo Store Session Store",err);
});

const sessionOptions={
    store:store,
    secret:process.env.SECRET,
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires:Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000
    }
};

//Using Routers
const listingRouter=require("./routes/listing.js");
const reviewRouter=require("./routes/review.js");
const userRouter=require("./routes/user.js");

//requiring the utility function.
const ExpressError=require("./utils/ExpressError.js");

//setting the ejs.
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"/views"));
app.use(express.static(path.join(__dirname,"/public/css")));
app.use(express.static(path.join(__dirname,"/public/js")));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine("ejs",ejsMate);

async function main(){
    // await mongoose.connect(MONGO_URL);
    await mongoose.connect(dburl);
}

main().then((res)=>{
    console.log("connection successful");
}).catch((err)=>{
    console.log(err);
});

// //root route.
// app.get("/",(req,res)=>{
//     res.send("Hi,I am root");
// });

//using session
app.use(session(sessionOptions));
app.use(flash());

//using passport package.
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
//To store user login credentials into session.
passport.serializeUser(User.serializeUser());
//To remove user login credentials from session.
passport.deserializeUser(User.deserializeUser());


//middleware to flash message
app.use((req,res,next)=>{
    res.locals.success=req.flash("success");
    res.locals.error=req.flash("error");
    // console.log(res.locals.success);//empty array
    //To show required functionality when user is login and logged out
    res.locals.currUser=req.user;
    next();
});

// //creating a Demo user
// app.get("/registeruser",async (req,res)=>{
//     let fakeUser=new User({
//         email:"abc@gmail.com",
//         username:"delta-student"
//     });

//     let registeredUser=await User.register(fakeUser, "helloworld");
//     res.send(registeredUser);
// });

// All /listings route
app.use("/listings", listingRouter);
// All routes start with /listinga/:id/reviews
app.use("/listings/:id/reviews", reviewRouter);
app.use("/", userRouter);

//handling any wrong route.
app.use("*",(req,res,next)=>{
    next(new ExpressError(404,"Page not found!"));
});

//Error Handling middleware.
app.use((err,req,res,next)=>{
    let {status=500,message="Some error occured"}=err;
    res.render("listings/error.ejs",{status,message});
});

//listening to the server.
app.listen(8080,()=>{
    console.log("Listening to the server:8080");
});