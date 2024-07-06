import express from "express"
import { adduser, loginUser, logoutUser } from "../controllers/userController.js"


export const routes = express.Router()

routes.post('/adduser' , adduser)
routes.post('/login' , loginUser)
routes.post('/logout' , logoutUser)


