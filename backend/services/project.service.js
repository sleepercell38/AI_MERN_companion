import  ProjectModel from "../models/project.model.js"; 
import mongoose from "mongoose";
//very important thin here is about importing we should not import * as  from the pages whoch have any default export 
//because it will not work, we have to import the model directly like this

//basically in service page we create the project with the help of model we created earlier

export const createProject=  async ({name, userId})=>{
       

    if(!name){
        throw new Error ("name is required")
    }

    if(!userId){
        throw new Error ("userId is required")
    }

    const project= await ProjectModel.create({
        name,
        Users:[
            userId
        ]
    })

    return project;
}

export const getAllprojectsbyuserid= async( {userId})=>{
    if(!userId){
        throw new Error ("userId is required")
    }

    const allprojects= await ProjectModel.find({Users: userId})

    return allprojects;
}


 export const addUserToProject= async({projectId, Users,userId})=>{
    if(!projectId){
        throw new Error ("projectId is required")
    }
    if(!Users || !Array.isArray(Users)){
        throw new Error ("Users must be an array")
    }

    if (!mongoose.Types.ObjectId.isValid(projectId)) {
        throw new Error("Invalid projectId")
    }
    if (!Array.isArray(Users) || Users.some(userId => !mongoose.Types.ObjectId.isValid(userId))) {
        throw new Error("Invalid userId(s) in users array")
    }


    if (!userId) {
        throw new Error("userId is required")
    }

    if (!mongoose.Types.ObjectId.isValid(userId)) {
        throw new Error("Invalid userId")
    }

    const project= await ProjectModel.findOne({    //basically here we are checking if the project exists and if the    user is part of the project   two simple checks made by this project constanat 
        _id:projectId,
        Users: userId
    })

    if(!project){
        throw new Error("Project not found or user is not part of the project")
    }

    //now here would add the user to the project if all the conditions got fulfilled without any error 
    //two prior check were made checking tat does the project exists and does the user is a part of the project

    const updateproject= await ProjectModel.findByIdAndUpdate({
        _id:projectId
    },{
        $addToSet:{
            Users:{$each : Users}
        }
    },{
        new: true,   //this means it will retuen thw updated document
    })
    //basically the above syntax is new to me i know ... but its workflow is such that it will add the users to the project  with the help of these operators $addtoset and $each we could upadte the new users to the Users array 



    return updateproject; 
}

export const getprojectbyid=async({projectId})=>{
    if(!projectId){
        return res.status(400).json({message: "Project ID is required"});
    }
    if (!mongoose.Types.ObjectId.isValid(projectId)) {
        throw new Error("Invalid projectId")
    }// checking weather the project is a valid object id of mongoose or not

    const project= await ProjectModel.findOne({
        _id:projectId
    }).populate("Users","email") //basically here we are populating the Users field with the email field of the user model so that we could get the email of the users who are part of the project  ..means replacing the users array with the actual detail (here only email ) of the users who are part of the project

    return project;

}