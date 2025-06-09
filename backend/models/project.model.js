import mongoose from 'mongoose';

//basically in model pages we create the model ( how our data of project should be stored is written)

const projectSchema = new mongoose.Schema({
    name :{
        type: String,
        required: true,
        trim: true,
        unique: true,
        lowercase: true,

    },

    Users : [

        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'user',
            
        }
    ]


})


const ProjectModel = mongoose.model('Project', projectSchema);
export default ProjectModel;
// This code defines a Mongoose schema for a project model in a Node.js application.