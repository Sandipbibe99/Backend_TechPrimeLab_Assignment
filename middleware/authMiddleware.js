import jwt from 'jsonwebtoken'



export const verifyToken = (request , response , next) => {

    const token = request.cookies.token

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