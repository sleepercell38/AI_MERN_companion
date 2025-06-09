import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// Create a user schema

const UserSchema = new mongoose.Schema({
   email:{  
    type:String,
    required:true,
    unique:true,
    trim:true,
    lowercase:true,
    minLength:[6, "Email must be at least 6 characters"],
    maxLength:[32, "Email must be at most 32 characters"],


   },
   password:{
    type:String,
    required:true,
   },
})


//some methods for creating the user model

UserSchema.statics.hashpassword= async function(password){
    return await bcrypt.hash(password, 10);
}

UserSchema.methods.comparepassword= async function(password){
    return  bcrypt.compare(password, this.password);
}

UserSchema.methods.jwtToken= function(){
     return jwt.sign({email:this.email}, process.env.JWT_SECRET,
        {expiresIn:"24h"}
      )
}


//finally creating the model

const User= mongoose.model("user",UserSchema);
export default User;