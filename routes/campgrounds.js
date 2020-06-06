var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
var middleware = require("../middleware");


router.get("/", function(req, res){
    // Get all campgrounds from DB 
    Campground.find({}, function(err, allCampgrounds){
        if(err){
            console.log(err);
        } else {
             res.render("campgrounds/index", {campgrounds: allCampgrounds, page: 'campgrounds'});
        }
    });
});

// Create - add new campground to DB
router.post("/", middleware.isLoggedIn, function(req, res){
    //get data from form and add to campgrounds array 
    var name = req.body.name;
    var price = req.body.price;
    var image = req.body.image;
    var desc = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    };
    var newCampground = {name: name, price: price, image:image, description: desc, author:author};
    
    Campground.create(newCampground, function(err, newlyCreated){
        if(err){
            console.log(err);
        } else {
               //redirect back to campground page 
               console.log(newlyCreated);
             res.redirect("/campgrounds"); 
        }
         
    });
  
});
// NEW - show form to create new campground
router.get("/new", middleware.isLoggedIn,function (req, res){
    res.render("campgrounds/new");
});

//SHOW - shows more info about one campground 
router.get("/:id", function(req, res) {
    //find the campground with provided ID 
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
        if(err || !foundCampground){
            req.flash("error","Campground not found");
            return res.redirect("back");
        } else {
            //console.log(foundCampground);
            //render show template with that campground 
            res.render("campgrounds/show", {campground: foundCampground});
        } 
    }); 
});

//EDIT CAMPGROUND ROUTE 
router.get("/:id/edit", middleware.checkCampgroundsOwnership,  function(req, res){ 
     Campground.findById(req.params.id, function(err, foundCampground){
       res.render("campgrounds/edit", {campground: foundCampground});  
     });   
});

// UPDATE CAMPGROUND ROUTE
router.put("/:id", middleware.checkCampgroundsOwnership,  function(req, res){
    //find and update the correct campground
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
        if(err){
            res.redirect("/campgrounds");
        } else { 
            res.redirect("/campgrounds/" + req.params.id);
        
        }
    });
});

//DESTROY CAMPGROUND ROUTE
router.delete("/:id", middleware.checkCampgroundsOwnership, function(req, res,){
    
   Campground.findByIdAndDelete(req.params.id, req.body.campground, function(err){
     if(err){
         res.redirect("/campgrounds");
         console.log(err);
     } else {
        res.redirect("/campgrounds");
     }
  });
});

module.exports = router;