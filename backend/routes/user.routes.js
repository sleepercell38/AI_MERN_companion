import * as userController from "../controller/user.controller.js";
import { body } from 'express-validator';
import { Router } from 'express';
import * as Authmiddleware from "../middleware/user.Auth.js";

const router = Router();

router.post("/register",
    body("email").isEmail().withMessage("Please enter a valid email"),
    body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters long"),
    userController.createusercontroller
);

router.post("/login",
    body("email").isEmail().withMessage("Please enter a valid email"),
    body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters long"),
    userController.loginusercontroller
);

router.get("/profile",Authmiddleware.authuser,userController.profilecontroller)

router.get("/logout",Authmiddleware.authuser,userController.logoutcontroller)


//we will create another route to get all the users that are loggid in the database expect the one who is currently loggedin

router.get("/getallusers", Authmiddleware.authuser,userController.getalluserscontroller)


export default router;