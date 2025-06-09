import jwt from 'jsonwebtoken';
import redisClient from '../services/redis.service.js';

export const authuser = async (req, res, next) => {
    const token = req.cookies.token || req.headers.authorization?.split(" ")[1];
    if (!token) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    
    const isBlacklisted= await redisClient.get(token);
    if (isBlacklisted) {
        res.cookie("token", "",)
        return res.status(401).json({ message: "Unauthorized access" });
    }

    const decoded= jwt.verify(token,process.env.JWT_SECRET);
    // console.log(decoded);   //basically her we got the user id of the user who is logged in
    if (!decoded) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    req.user = decoded;    //and here we set the req.user to the decoded token so that we can use it in the user controller
    next();
}





//basically here we are checking that wheather the user is authorized or not so that he could access the profile page 
//so first we check for the token in the cookies and if not found then we check for the token in the headers and when thw token is found we verify with the jwt secret key and then 

//we get the user id and we pass it to a variale and then to the req.user  so that we can use it earlier in the user controlleer