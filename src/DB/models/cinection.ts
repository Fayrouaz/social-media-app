
import mongoose from "mongoose";


export const connectDB = async()=>{

  try{
     const connection = await mongoose.connect(
       process.env.DB_URI as string,
        {
         serverSelectionTimeoutMS:5000,
        }
   )
     console.log(`MonogoDB connection : ${connection.connection.host}`);
  } catch (error){
    console.log(`Error : ${(error as Error).message}`);
    
  }


}

export default connectDB;