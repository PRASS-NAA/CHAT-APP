import mongoose from "mongoose";

const connectToMongoDB = async () =>
{
    try{
        await mongoose.connect(process.env.MONGO_DB_URI);
        console.log("DB Connection Established Successfully");

    }catch(err)
    {
        console.log("Error Connecting TO DB : ",err.message);
    }
};

export default connectToMongoDB;