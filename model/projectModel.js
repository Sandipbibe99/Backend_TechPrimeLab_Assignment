import mongoose from "mongoose"

const projectSchema = new mongoose.Schema({

    projectName : {
        type : String,
        require : true,
     },
     reason : {
        type : String,
        require : true,
     },
     type : {
        type : String,
        require : true,
     },
     division : {
        type : String,
        require : true,
     },
     category : {
        type : String,
        require : true,
     },
     priority : {
        type : String,
        require : true,
     },
     department : {
        type : String,
        require : true,
     },
     startDate : {
        type : Date,
        require : true,
     },
     endDate : {
        type : Date,
        require : true,
     },
     location : {
        type : String,
        require : true,
     },
     status : {
        type : String,
        require : true,
     },
     userId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "TechUser",
        require: true,
     }
})

const Project = mongoose.model("Project" , projectSchema)
export default Project