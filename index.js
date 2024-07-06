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
    origin: ['https://sandip-tech-prime-lab.netlify.app', 'http://localhost:3000' , 'http://192.168.0.106:3000'],
    credentials: true,
};
app.use(cors(corsOptions));

app.use(cors(corsOptions));

const PORT = process.env.PORT || 4001


dbConnect().then(() => [
    app.listen(PORT   ,() => {
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