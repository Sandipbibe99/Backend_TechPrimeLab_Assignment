import express from "express"
import cors from 'express'
import dotenv from 'dotenv'
import { dbConnect } from './config/dbConfig.js'

const app = express()
app.use(cors())
dotenv.config()

const PORT = process.env.PORT || 4001


dbConnect().then(() => [
    app.listen(PORT , () => {
        console.log(`App running on port ${PORT}`)
    })
]).catch((error) => {
    console.log("Failed to connect to database" + error)
}
)

// app.use(express.json())
// app.use('/api' , )