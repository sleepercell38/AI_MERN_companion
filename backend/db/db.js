import mongoose from 'mongoose';

const connectDB =  () => {
    mongoose.connect(process.env.MONGO_URI,{ useNewUrlParser: true, useUnifiedTopology: true }).then(()=>{
        console.log("database connected");
    }).catch((err)=>{
        console.log(err)
    })
}

export default connectDB;