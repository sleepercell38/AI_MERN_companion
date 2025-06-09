
import usermodel from '../models/user.model.js';

export const createUser= async({email, password})=>{

    if(!email || !password){
        throw new Error("email and password is required");
    }
    const hashedPassword= await usermodel.hashpassword(password);
    const user= await usermodel.create({
        email,
        password:hashedPassword,
    })

    return user;
}

//basically here we are creating a user by hashing the password and then storing it in the database
// this function will be used in the controller to create a user



export const getAllUsers = async ({userId }) => {
    if (!userId  ) {
        throw new Error("userId is required");
    }

    // Find all users except the one with the given userId
    const users = await usermodel.find({
        _id: { $ne: userId }
    });  //basically with this operator $ne we are checking that the userId is not equal to the userId passed in the function

    //so it will return all the logged in user expect the user id we have passed here  

    return users;

}