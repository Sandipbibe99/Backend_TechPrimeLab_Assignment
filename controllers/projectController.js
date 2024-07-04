import Project from "../model/projectModel.js"
import User from "../model/userModel.js"


    
export const addProject = async(request , response) => {
  
    try{

        const { projectName , reason , type , division , category , startDate , endDate , location , status} = request.body
        const userId = request.userId
    
        if ( !projectName || !reason || !type || !division || !category || !startDate || !endDate || !location || !status) {
            return response.status(404).json({Error : "Please provide all details" , Success : false})
        }
        
       
        const start = new Date(startDate)
        const end = new Date(endDate)
    
        if(start >= end) {
           return response.status(404).json({Error : "End Date is smaller than the Start date" , Success : false})
        }
        const user = await User.findById(userId)
        if(!userId) {
            return response.status(404).json({Error : "User not found" , Success : false})
        }
        else{
            const newProject = new Project({
                projectName ,
                reason ,
                type ,
                division , 
                category , 
                startDate , 
                endDate ,
                location , 
                status,
                userId : userId,
            })
    
            const saveProject = await Project.create(newProject)
            
            return  response.status(200).json({Message : "Project saved Successfully" , Success : true})
    
        }



    }
    catch(error){
        return  response.status(500).json({error : error.message , Success : false})
    }
 
} 

export const getAllProjects = async(request , response) => {

    try{
          
        const userId = request.userId

        const getAllProject = await Project.find({userId})

        if(getAllProject.length === 0){
            return response.status(404).json({Success : false , Message : "Nothing to show"})
        }
    
        return response.status(200).json({Success : true , Message : "Data get successfully" , projects : getAllProject})
    }
    catch(error) {
        return  response.status(500).json({error : "Internal Server Error" , Success : false})
    }
 
}

export const updateStatus = async(request , response) => {
      

    try{
     const {_id , status} = request.query

     const updatedProject = await Project.findByIdAndUpdate(_id , {status} , {new : true})

     if(!updatedProject) {
        return response.status(404).json({ Success: false, Message: "Project not found or could not be updated." });
     }

     return response.status(200).json({ Success: true, Message: "Project updated successfully." });
    }catch(error) {
        return  response.status(500).json({error : "Internal Server Error" , Success : false})
    }
}

export const getCountAccordingToStatus = async(request , response) => {

  try{
         const userId = request.userId
        const total = await Project.countDocuments({userId})
        const runningCount = await Project.countDocuments({status : "running" , userId })
        const cancelledCount = await Project.countDocuments({status : "cancelled" , userId})
        const closedCount = await Project.countDocuments({status : "closed" , userId})

        const count = {
            total : total,
            running : runningCount,
            closed : closedCount,
            cancelled : cancelledCount
         }

        return response.status(200).json({Success : true , count})
  }
  catch{
    return  response.status(500).json({error : "Internal Server Error" , Success : false})
  }

}


export const getClosureDelayCount = async(request , response) => {

    try{
            const currentDate = new Date
            const userId = request.userId

            const count = await Project.countDocuments({
                userId ,
                endDate : { $lt : currentDate}
            })

             return response.status(200).json({Success : true , countDelayProjects : count})
    }
    catch{
      return  response.status(500).json({error : "Internal Server Error" , Success : false})
    }
  
  }