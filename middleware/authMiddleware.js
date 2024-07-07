import jwt from 'jsonwebtoken'
import express from 'express'
import cookieParser from "cookie-parser"

const app = express();
app.use(cookieParser());

export const verifyToken = (request, response, next) => {
    const token = request.cookies.token;

    if (!token) {
       
        return response.status(401).json({ error: 'Unauthorized', success: false });
    }

    try {
        jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
            if (err) {
               
              
                return response.status(401).json({ error: 'Unauthorized', success: false });
            }
        
            request.userId = decoded.userId;
            next();
        });
    } catch (error) {
       
       
        return response.status(500).json({ error: 'Internal Server Error', success: false });
    }
};