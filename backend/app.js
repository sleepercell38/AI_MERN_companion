import express from "express";
import connectDB from "./db/db.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import Airoutes from "./routes/Ai.routes.js"

connectDB();
import userRoutes from "./routes/user.routes.js";
import projectroutes from "./routes/project.routes.js";


const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true
}));

app.use("/users",userRoutes)
app.use("/projects", projectroutes);
app.use("/ai", Airoutes )

app.get("/", (req, res) => {
  res.send("Hello World!");
}
);


export default app;


