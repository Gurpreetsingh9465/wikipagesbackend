const mongoose = require('mongoose');
const bcrypt = require("bcrypt");
const userSchema = new mongoose.Schema({
  email: {type:String,required:true, unique: true, index: true},
  id: {type:String,required:true, unique: true, index: true},
  password: {type:String, required:true, default: ''},
  name: {type: String, required: true},
  dp: {type: String, required: true, default: '/default.png'},
  isGoogleLogin: {type: Boolean, required: true, default: false},
  isVerified: {type: Boolean, required: true, default: false},
  bio: {type: String, default: ''},
},{timestamps: true});

userSchema.methods.encryptPassword = function(password){
  return bcrypt.hashSync(password,bcrypt.genSaltSync(10),null)
}

userSchema.methods.validPassword = function(password){
  return bcrypt.compareSync(password,this.password);
}

module.exports = mongoose.model("User",userSchema);