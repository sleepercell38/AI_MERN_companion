import * as projectservice from '../services/project.service.js';
import ProjectModel from '../models/project.model.js';
import usermodel from '../models/user.model.js';
import {validationResult} from 'express-validator';

export const createprojectcontroller= async(req, res)=>{
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const {name} = req.body;
        const loggedinuser= await usermodel.findOne({email: req.user.email});
        const userId= loggedinuser._id;

        const project= await projectservice.createProject({name,userId})

        res.status(201).json(project)

        
    } catch (error) {
        console.log(error);
        res.status(400).send(error.message)
    }

}


export const getallprojectscontroller= async(req, res)=>{
    try{
        const loggedinuser= await usermodel.findOne({email: req.user.email});

        const allprojects= await projectservice.getAllprojectsbyuserid({userId: loggedinuser._id})
        res.status(200).json({
            projects: allprojects
        });

       // the workflow of this is such that firslty the projectcontroller page would be executed..here we have created a logged in user where we would get the userid of the logged in user ..and then the workflow would be re directed to the service page ...where we would get the all the projects of the user by using the particular userid  and then we would return all the projects ... to the controller page and then from here we would send the response to the frontend..!!!
    }catch{
        console.log(error);
        res.status(400).send(error.message)
    }
}


export const addusertoprojectcontroller= async(req, res)=>{
    const errors= validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()});
    }
    try{
        const { projectId, Users } = req.body;

        const loggedinuser=await usermodel.findOne({email:req.user.email});
        const userId = loggedinuser._id;

        const project =await projectservice.addUserToProject({
            projectId,                                        
            Users,
            userId : loggedinuser._id
        })
        res.status(200).json({
            project,
            message: "User added to project successfully"
        });

    }catch(error){
        console.log(error);
        res.status(400).send(error.message);
    }




}


export const getprojectbyid= async(req,res)=>{
    const {projectId}=req.params;
   
    try{
        const project = await projectservice.getprojectbyid({projectId});

        return res.status(200).json({
            project,
            message: "Project fetched successfully"
        });
        

    }catch(error){
        console.log(error);
        res.status(400).send(error.message);
    }

}