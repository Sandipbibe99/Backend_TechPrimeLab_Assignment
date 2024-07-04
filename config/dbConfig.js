import mongoose from "mongoose";


export async function dbConnect() {
   
    try{
    
            mongoose.connect(process.env.MONGODB_URL)
            const connection = mongoose.connection

            connection.on('connected' , () => {
                 console.log('Mongodb connected')
            })

            connection.on('error' , (error) => {
                console.log('Mongodb connection error' + error)
                process.exit()
            })
    }
    catch (error){
        console.log("Something wend wrong in connecting to DB")
        console.log(error)
    }
}