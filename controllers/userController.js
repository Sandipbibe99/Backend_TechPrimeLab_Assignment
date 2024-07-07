import User from "../model/userModel.js"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

export const adduser = async(request , response) => {

    try{
        const {name , username , email , contact , password , confirmPassword} = request.body
      
        const isUserExist = await User.findOne({email})
  
        if(!name || !username || !email || !password || !confirmPassword){
          return  response.status(404).json({Error : "Please provide all details" , Success : false})
        }
        else if(isUserExist) {
          return response.status(400).json({Error : "User already Exist" , Success : false})
        }
        else if(password !== confirmPassword) {
          return response.status(400).json({Error : "Both Password must be same" , Success : false})
        }
        else {
          const salt = await bcrypt.genSalt(10)
          const hashedPassword = await bcrypt.hash(password , salt)
  
          const newUser = new User({
              name , 
              username,
              email,
              contact ,
              password : hashedPassword,
  
          })
          const savedUser = await User.create(newUser)
  
          return  response.status(200).json({Message : "User registered Successfully" , Success : true})
        }
    }catch(error) {
        return  response.status(500).json({error : error.message , Success : false}) 
    }

     


}

export const loginUser = async(request , response) => {

   try{
    const {email , password} = request.body
    const isUserExist = await User.findOne({email})

    if(!email || !password) {
       return response.status(400).json({error : "Please provide all details" , Success : false})
    }
    else if(!isUserExist){
      return response.status(404).json({Success : false , error : "Invalid user"})
    }
    else {
       const isMatch = await bcrypt.compare(password , isUserExist.password) 
       if(isMatch && (isUserExist.email === email)) {
           const token = jwt.sign({userId : isUserExist._id} , process.env.SECRET_KEY , {expiresIn : '1h'})
           
           response.cookie('token', token, {
            secure: true, 
            httpOnly: true,
            maxAge: 3600000000, 
            sameSite: 'None',
            path: '/' 
        });

           return response.status(200).json({Success : true , message : "Login successful" })
         
       }
       else{
        return  response.status(401).json({Success : false , error : "Invalid user"})

       }
      
    }
   }catch(error) {
    return  response.status(500).json({error : error.message , Success : false}) 
   
   }
  
}

export const logoutUser = async (request, response) => {
  try {
    const token = request.cookies.token;

    if (!token) {
      return response.status(400).json({ success: false, message: "No token provided" });
    }

    response.clearCookie("token");
    return response.status(200).json({ success: true, message: "Logged out successfully" });
  } catch (error) {
    return response.status(500).json({ error: error.message, success: false });
  }
};

