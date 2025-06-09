import * as Aiservices from "../services/Ai.service.js"


export const getresult=async( req, res)=>{
    try{
        const {prompt} = req.query;
        const result=  await Aiservices.generateResult(prompt);
        res.send(result);

    }catch{
        error=>{
            res.status(500).send({message: error})
        }
    }
}