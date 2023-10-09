import mongoose from 'mongoose';

//===== db connection =====

export default async function connectMongoDB() {
    try {
        await mongoose.connect(process.env.MONGO_URI,{
            dbName: 'clubs',
        }, { useNewUrlParser: true, useUnifiedTopology: true })
    } catch (error){
        console.log(error)
    }
}
