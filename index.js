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
        callback(null, origin); // Reflect the origin in the CORS response
    },
    credentials: true
};

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", req.headers.origin); // Allow the request's origin
    res.header("Access-Control-Allow-Credentials", "true"); // Allow credentials
    res.header("Access-Control-Allow-Methods", "GET,HEAD,PUT,PATCH,POST,DELETE"); // Allow these methods
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization"); // Allow these headers
    next();
});

app.options('*', cors(corsOptions));


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