import mongoose from "mongoose"
import Project from "../model/projectModel.js"
import User from "../model/userModel.js"


    
export const addProject = async(request , response) => {
  
    try{

        const { projectName , reason , type , division , category , priority , department , startDate , endDate , location , status  } = request.body
         const userId = request.userId
    
        if ( !projectName || !reason || !type || !division || !category || !startDate || !endDate || !location || !status || !department || !priority || !userId) {
            return response.status(404).json({error : "Please provide all details" , Success : false})
        }
        
       
        const start = new Date(startDate)
        const end = new Date(endDate)
    
        if(start >= end) {
           return response.status(404).json({error : "End Date is smaller than the Start date" , Success : false})
        }
        const user = await User.findById(userId)
        if(!userId) {
            return response.status(404).json({error : "User not found" , Success : false})
        }
        else{
            const newProject = new Project({
                projectName ,
                reason ,
                type ,
                division , 
                category , 
                priority,
                department,
                startDate , 
                endDate ,
                location , 
                status,
                userId : userId,
            })
    
            const saveProject = await Project.create(newProject)
            
            return  response.status(200).json({message : "Project saved Successfully" , Success : true})
    
        }



    }
    catch(error){
        return  response.status(500).json({error : error.message , Success : false})
        console.log(error)
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
         
         const statusCounts = await Project.aggregate([
            {
                $match : { userId : new mongoose.Types.ObjectId(userId)}
            },
            {
                $group : {
                    _id : "$status",
                    count : {$sum : 1}
                }
            }
         ])

         const count = {
            total : statusCounts.reduce((acc , curr) => acc + curr.count , 0),
            running: 0,
            cancelled: 0,
            closed: 0
         }

         statusCounts.forEach((status) => {
            if(status._id === "running") {
                count.running = status.count;
            } else if (status._id === "cancelled") {
                count.cancelled = status.count;
            } else if (status._id === "closed") {
                count.closed = status.count;
            }
         })

        return response.status(200).json({Success : true , count})
  }
  catch (error){
    console.error("Error in getCountAccordingToStatus:", error);
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

  export const getCountByStatusAndDepartment = async (request, response) => {
    try {
        const userId = request.userId;
        const departments = ['strategy', 'finance', 'quality', 'maintenance', 'stores', 'hr'];
    
      
        const results = await Project.aggregate([
          {
            $match: { userId: new mongoose.Types.ObjectId(userId) }
          },
          {
            $facet: {
              totalCounts: [
                {
                  $group: {
                    _id: "$department",
                    count: { $sum: 1 }
                  }
                },
                {
                  $project: {
                    _id: 0,
                    department: "$_id",
                    count: 1
                  }
                }
              ],
              closedCounts: [
                {
                  $match: { status: "closed" }
                },
                {
                  $group: {
                    _id: "$department",
                    count: { $sum: 1 }
                  }
                },
                {
                  $project: {
                    _id: 0,
                    department: "$_id",
                    count: 1
                  }
                }
              ]
            }
          }
        ]);
    
        const totalProjects = results[0].totalCounts;
        const closedProjects = results[0].closedCounts;
    
       
        const countTotal = departments.map(dept => {
          const found = totalProjects.find(proj => proj.department === dept);
          return found ? found.count : 0;
        });
    
        const countClosed = departments.map(dept => {
          const found = closedProjects.find(proj => proj.department === dept);
          return found ? found.count : 0;
        });
    
        const result = {
          departments,
          series: [
            {
              name: 'total',
              countTotal: countTotal
            },
            {
              name: 'closed',
              countClosed: countClosed
            }
          ]
        };
    
        return response.status(200).json(result);
      } catch (error) {
        console.error("Error in getProjectCountsByDepartment:", error);
        return response.status(500).json({ error: error.message, Success: false });
      }
  };


//  department : [strategy , finance , quality , maintainance , stores , hr]
//   series: [
//     {
//         name: 'total',
//         count: [10, 20, 10, 10, 10, 10]
//     },
//     {
//         name: 'closed',
//         count: [9, 9, 9, 9, 5, 6]
//     }
// ]
