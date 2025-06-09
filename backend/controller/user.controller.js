//basically in this file we will validate the credentials taken while creating the user;



import * as userservice from '../services/user.service.js';
import { validationResult } from 'express-validator';
import usermodel from '../models/user.model.js';
import redisClient from '../services/redis.service.js';

export const createusercontroller = async (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
 
    try {
        const user = await userservice.createUser(req.body);
        const token = await user.jwtToken();
        res.status(201).json({ user, token});

      }catch(error){
        res.status(400).send(error.message);
    }

} 

export const loginusercontroller = async (req, res) => {

     const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(401).json({ errors: errors.array() }); }

    try {
        const { email, password } = req.body;
        const user = await usermodel.findOne({ email }).select("+password");
        if(!user){
            return res.status(401).json({message:"invalid credentials"});}
        const ismatch= await user.comparepassword(password);
        if(!ismatch){
            return res.status(401).json({message:"invalid credentials"});}


            const token = await user.jwtToken();
            res.status(200).json({ user, token });

        }catch(error){
        res.status(400).send(error.message);    }


}

export const profilecontroller = async (req, res) => {

     //basically here we are checking wheather the user is authorized or not so that he could access the profile page
    res.status(200).json({ users: req.user });
    //after checking the token we pass the users details to the frontend so that the user could access the profile page
}

export const logoutcontroller = async (req, res) => {
        try{
           
            const token = req.cookies.token || req.headers.authorization?.split(" ")[1];
            redisClient.set(token, "logout", "EX", 60 * 60 * 24); // Set token in Redis with an expiration time of 1 hour
            res.status(200).json({ message: "Logged out successfully" });



        }catch(err){
            res.status(400).json({ message: "Error logging out" });
        }


}

export const getalluserscontroller=async(req,res)=>{
    try{
        const loggedinuser= await usermodel.findOne({ email: req.user.email})
        const userId = loggedinuser._id;
    
        const allusers= await userservice.getAllUsers({ userId  }); 


        return res.status(200).json({ users: allusers });

    }catch(error){
        console.log(error);
        res.status(400).json({ message: "Error fetching users" });
    }
}