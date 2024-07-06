import express from "express"
import cors from 'cors'
import dotenv from 'dotenv'
import { dbConnect } from './config/dbConfig.js'
import { routes } from "./routes/routes.js"
import projectRoutes from "./routes/projectRoutes.js"
import cookieParser from "cookie-parser"

const app = express()

dotenv.config()
const corsOptions = {
    origin: (origin, callback) => {
        
        if (!origin) return callback(null, true);
        callback(null, true);
    },
    credentials: true, 
};
app.use(cors(corsOptions));

const PORT = process.env.PORT || 4001
// const SERVER = process.env.SERVER || 'localhost';

dbConnect().then(() => [
    app.listen(PORT  , () => {
        console.log(`App running on port ${PORT}`)
    })
]).catch((error) => {
    console.log("Failed to connect to database" + error)
}
)

app.use(express.json())
app.use(cookieParser())
app.use("/api/user" , routes)
app.use('/api/project' , projectRoutes )