import mongoose from "mongoose";


const userSchema = new mongoose.Schema({
    name : {
        type : String,
        required : true,
        unique : false,
    },
    username : {
        type : String,
        required : true,
        unique : true,
    },
    email : {
        type : String,
        required : true,
        unique : true,
    }, 
    contact : {
        type : Number,
        required : false,
        unique : false,
    },
    password : {
        type : String,
        required : true,
        unique : false,
    },
   
})

const User = mongoose.model('TechUser' , userSchema)
export default User