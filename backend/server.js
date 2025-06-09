import "dotenv/config.js";
import { Server } from "socket.io";
import jwt from "jsonwebtoken"
import ProjectModel from "./models/project.model.js";
import mongoose from "mongoose";
import { generateResult } from "./services/Ai.service.js";




import  app from "./app.js";
import http from "http";


const server = http.createServer(app);  //basically here we created the server and we passed the app.js into it   

const io = new Server(server ,{
   cors: {
    origin: process.env.CLIENT_URL,
    credentials: true, // if needed
  }
});  //here we imported the server from the socket io and then created passed the server we created to the socket io server and stored it in the (io )conatant which we would use for further purpose


  io.use(async(Socket,next)=>{
    try{
      //here we would try to find the token so than unauthorized users cannot establist a socket connection

      const token = Socket.handshake.auth?.token || Socket.handshake.headers.authorization?.split(" ")[1];
      if(!token){
        return next(new Error("authentication error"))
      }

      const decoded= jwt.verify(token, process.env.JWT_SECRET)
      if(!decoded){
        return next(new Error("authentication error"))
      }



      const projectId= Socket.handshake.query.projectId;
      if(!mongoose.Types.ObjectId.isValid(projectId)){
        return next(new Error("invalid project"))
      }

      Socket.project=  await ProjectModel.findById(projectId)


      Socket.user = decoded;
      next();

    }catch{
      (error)=>{
        next(error)
      }

    }

  })


io.on('connection', Socket => {      //basically this is a  callback function which would run reach and everytime the socket io connection is established 
  console.log("a user connected")



//here we created a roomid   by converting the projectid to a string 
  Socket.roomId= Socket.project._id.toString()
  
  //with the help of project id ..when the user establish a connection then the user would automatically be connected to the room 
  Socket.join(Socket.roomId);
  // Socket.on('event', data => { /* … */ });
  // Socket.on('disconnect', () => { /* … */ });



  //this the socket message event and the callback function which would run basically here the message would be brodcasted to the to room members only and the message that would be there would be emmited with the event name like 'Project-message' 
  Socket.on ("project-message", async data=> {

    //code for the conversation with ai 

    const message= data.message;
    const aiispresent=message.includes("@ai")
    if(aiispresent) {
    
      const prompt= message.replace("@ai", "");
      const result = await generateResult(prompt)

      io.to(Socket.roomId).emit("project-message",{
        message:result,
        sender:{
           _id: "ai",
           email : "AI"

        }
      })
    }

    console.log(data)
    Socket.broadcast.to(Socket.roomId).emit("project-message",data)
  })



});



server.listen(process.env.PORT, () => { 
  console.log(`Server is running on port ${process.env.PORT}`);
}
);






















// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImlnbnZpc2hhbEBnbWFpbC5jb20iLCJpYXQiOjE3NDg1OTEzODYsImV4cCI6MTc0ODY3Nzc4Nn0.nDuoetwNOSccFp-z4OF8hlUL2ojlK_IrJEYbGT8zYKU

