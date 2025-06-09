import {Router} from "express";
import * as Aicontroller from "../controller/Ai.controller.js"
const router= Router();


router.get("/get-result",Aicontroller.getresult)








export default router