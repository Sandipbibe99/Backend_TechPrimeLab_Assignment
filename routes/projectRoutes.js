import express from 'express'
import { verifyToken } from '../middleware/authMiddleware.js'
import { addProject, getAllProjects, getClosureDelayCount, getCountAccordingToStatus, updateStatus } from '../controllers/projectController.js'

const projectRoutes = express.Router()

projectRoutes.post('/addproject' , verifyToken , addProject)
projectRoutes.get('/getProjectsbyUserid' , verifyToken , getAllProjects)
projectRoutes.patch('/updatestatus' , verifyToken , updateStatus)
projectRoutes.get('/getCountAccordingToStatus' , verifyToken , getCountAccordingToStatus)
projectRoutes.get('/getClosureDelayCount' , verifyToken , getClosureDelayCount)


export default projectRoutes