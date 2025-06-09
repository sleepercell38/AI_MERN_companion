import {Router} from 'express';
import {body} from 'express-validator';
import * as projectcontroller from '../controller/project.controller.js';
import * as authmiddleware from '../middleware/user.Auth.js';

const router = Router();


router.post("/create", 
    authmiddleware.authuser,
    body('name').notEmpty().withMessage('Name is required'),
    projectcontroller.createprojectcontroller
 )

router.get("/getall", 
    authmiddleware.authuser,
    projectcontroller.getallprojectscontroller)

router.put("/add-user", 
    authmiddleware.authuser,
    body('projectId').notEmpty().withMessage('Project ID is required'),
    body('Users').isArray().withMessage('Users must be an array'),
    projectcontroller.addusertoprojectcontroller )

router.get("/get-project-info/:projectId", 
    authmiddleware.authuser,projectcontroller.getprojectbyid
   )





 export default router;

