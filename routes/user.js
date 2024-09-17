const express=require("express");
const router=express.Router();
const wrapAsync=require("../utils/wrapAsync.js");
const User=require("../models/user.js");
const passport=require("passport");
const { saveRedirectUrl } = require("../middleware.js");
const userController=require("../controllers/users.js");

router
        .route("/signup")
        .get(userController.renderSingupForm)
        .post(wrapAsync(userController.signup)
);
        
router
        .route("/login")
        .get(userController.renderLoginForm)
        .post(saveRedirectUrl,
                passport.authenticate('local',
                {failureRedirect:'/login',
                failureFlash:true}),
                wrapAsync(userController.afterLogin)
);


// //Providing login form to user
// router.get("/signup",userController.renderSingupForm);

// //Save user to  SibgUp route
// router.post("/signup",wrapAsync(userController.signup));

// //For user to login on platform. Login route
// router.get("/login",userController.renderLoginForm);

// //post route for login
// router.post("/login",saveRedirectUrl,
//         passport.authenticate('local',
//         {failureRedirect:'/login',
//         failureFlash:true}),
//         wrapAsync(userController.afterLogin));

//route for logout
router.get("/logout",userController.logoutRoute);

module.exports=router;