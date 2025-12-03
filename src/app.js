  const express = require('express'); 
const connectDB = require("./config/database")
const app = express();
const User = require("./models/user");
const {validateSignUpData} = require("../utils/validation")
const bcrypt = require("bcrypt")
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const {userAuth} = require("./middlewares/auth");

app.use(express.json());
app.use(cookieParser());


app.post("/signup", async(req,res)=>{
   try {
      // validate data
      validateSignUpData(req);
      const {firstName,lastName,emailId ,password} = req.body;
      // Encrypt pas sword
const passworHash = await bcrypt.hash(password,10)

   // creating new instance of user model
   const user = new User({
      firstName,
      lastName,
      emailId,
      password:passworHash,
   });
   
   await user.save();
   res.send("user added")
   }catch(err){
      res.status(400).send("Error saving the user"+ err.message)
   }
})

app.post("/login",async(req,res)=>{
   try{
const {emailId,password} = req.body;

const user = await User.findOne({emailId: emailId});
if(!user){
   throw new Error("Invalid credentials")
}
const isPasswordValid = await user.validatePassword(password);

if(isPasswordValid){
   // password is correct → login success
   const token = await user.getJWT();
   res.cookie("token", token, {
      expires: new Date(Date.now() + 8 * 3600000),
   });
   res.send("Login successful");
}else{
   // password is incorrect → throw error
   throw new Error("Password not correct");
}

   }catch(err){
      res.status(400).send("Error:" + err.message)
   }
})

app.get("/profile", userAuth, async(req,res)=> {
   try {
   const user = req.user;
   res.send(user);
   }catch (err) {
    res.status(400).send("Error:" + err.message)
   }
 })

app.post("/sendConnectionRequest", userAuth, async (req, res) => {
  const user = req.user;
  res.send(user.firstName + " Connection request sent by him");
});

    connectDB()
 .then(()=> {
    app.listen(3009,()=>{
    console.log("Hi my server started.")
});
 })
 .catch((err)=> {
    console.log("Not connected")
 })




 
