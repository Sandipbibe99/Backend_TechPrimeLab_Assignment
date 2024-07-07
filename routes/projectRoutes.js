import express from 'express'
import { verifyToken } from '../middleware/authMiddleware.js'
import { addProject, getAllProjects, getCountAccordingToStatus, getCountByStatusAndDepartment, updateStatus, verifytheuser } from '../controllers/projectController.js'

const projectRoutes = express.Router()

projectRoutes.post('/addproject'  , verifyToken , addProject)
projectRoutes.get('/getProjectsbyUserid' , verifyToken , getAllProjects)
projectRoutes.patch('/updatestatus' , verifyToken , updateStatus)
projectRoutes.get('/getCountAccordingToStatus' , verifyToken , getCountAccordingToStatus)
projectRoutes.get('/getCountByStatusAndDepartment' , verifyToken , getCountByStatusAndDepartment)
projectRoutes.get('/checkAuth' , verifyToken , verifytheuser)


export default projectRoutes