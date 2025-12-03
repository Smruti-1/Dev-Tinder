const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
    firstName : {
        type : String
    },
    lastName : {
type : String
    },
    emailId : {
type : String,
lowercase:true,
required:true,
unique: true,
trim: true,
validate(value){
    if(!validator.isEmail(value)){
        throw new Error("Invalid emaail address"+ value);
    }
},
    },
    password : {
        type: String,
        required: true,
    },
    age : {
        type : Number,
        min:19,
    },
    gender : {
        type : String,
       validate(value){
        if(!["male","female","others"].includes(value)){
            throw new Error("Gender not valid")
        }
        },
    },
    photoUrl:{
        type: String,
        default :"https://randomuser.me/api/portraits/lego/1.jpg",
    },
     about : {
        type : String,
        default : "This is a default about of the user!"
    },
    skills:{
        type: [String],
    },
},
{
timestamps:true,
}
    
);
// dont use srrow function this will not work bleow this
userSchema.methods.getJWT = async function() {
    const user = this;
 const token = await jwt.sign({_id: user._id},"DevTinder@0109",{
    expiresIn:"1d",
 });
 return token;
};

userSchema.methods.validatePassword = async function(passwordInputByUser){
    const user = this;
    const passwordHash = user.password;
    const isPasswordValid = await bcrypt.compare(
     passwordInputByUser,
    passwordHash
);
return isPasswordValid;

}
module.exports = mongoose.model("User",userSchema)


