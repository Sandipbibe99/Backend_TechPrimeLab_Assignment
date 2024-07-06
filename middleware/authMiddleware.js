import jwt from 'jsonwebtoken'
import express from 'express'
import cookieParser from "cookie-parser"

const app = express();
app.use(cookieParser());


export const verifyToken = (request , response , next) => {

    const token = request.cookies.token
    console.log(request)

    if(!token) {
        return response.status(401).json({error : "No token" , Success : false })
    }

    try{
        
        const decoded = jwt.verify(token , process.env.SECRET_KEY)
        request.userId = decoded.userId
        next();

    }catch(error) {
        return response.status(401).json({ error: 'Unauthorized', success: false });
    }
}