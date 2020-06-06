var express    = require("express"),
    app        = express(),
    bodyParser = require("body-parser"),
    mongoose   = require("mongoose"),
    flash      = require("connect-flash"),
    passport   = require("passport"),
    LocalStrategy = require("passport-local"),
    methodOverride = require("method-override"),
    User       = require("./models/user");
    require('dotenv').config();
  
    
  // requring routes  
var commentRoutes     = require("./routes/comments"),
    campgroundsRoutes = require("./routes/campgrounds"),
    indexRoutes       = require("./routes/index"); 
    
mongoose.connect(process.env.DATABASEURL, {useNewUrlParser: true, useUnifiedTopology:true});

mongoose.connect(process.env.DATABASEURL, {useNewUrlParser: true, useUnifiedTopology:true})
  .then(() => {
    console.log('Successfully connected to MongoDB Atlas!');
  })
  .catch((error) => {
    console.log('Unable to connect to MongoDB Atlas!');
    console.error(error);
})

mongoose.set('useFindAndModify', false);

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride('_method'));
app.use(flash()); 
//console.log(__dirname);


// PASSPORT CONFIGURATION cl
app.use(require("express-session")({
    secret: "Once again Rusty wins cutest dog!",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use(function(req, res, next){
   res.locals.currentUser =  req.user;
   res.locals.error = req.flash("error");
   res.locals.success = req.flash("success");
   next();
});

app.use("/", indexRoutes);
app.use("/campgrounds", campgroundsRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);




var server = app.listen(process.env.PORT || 3000, function() {
    var port = server.address().port;
    console.log("YelpCamp Has Started!", port);
});


