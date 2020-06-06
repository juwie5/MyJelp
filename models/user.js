// new code base 
// var mongoose = require("mongoose");
// var Schema = mongoose.Schema;
// var passportLocalMongoose = require("passport-local-mongoose");

// var User = new Schema({
//     username: String,
//     password: String
// });


// //var UserSchema = new mongoose.Schema({
    
// //});

// User.plugin(passportLocalMongoose);

// module.export = mongoose.model("User", User);

var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");

var UserSchema = new mongoose.Schema({
   username: String,
   password: String
});

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", UserSchema);