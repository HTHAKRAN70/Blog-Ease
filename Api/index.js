import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRoutes from './routes/user.route.js';
import authRoutes from './routes/auth.route.js '
import postRoutes from './routes/post.route.js';
import commentRoutes from './routes/comment.route.js';
import cookieParser from 'cookie-parser';
dotenv.config();
mongoose.connect(process.env.MONGO)
.then(
    ()=>{
        console.log('Mongodb is connected!');
    }
).catch((err)=>{
    console.log("error not connected mongodb", err);
})
const app =express();
app.use(express.json());
app.use(cookieParser());
app.use('/Api/user',userRoutes);  
app.use('/Api/auth',authRoutes);
app.use('/Api/post',postRoutes);
app.use('/Api/comment',commentRoutes);
app.use((err,req,res,next)=>{
    const statusCode=err.statuscode||500;
    const message=err.message||'Internal serv error';
    res.status(statusCode).json({
        succes:false,
        statusCode,
        message,
    });
})


app.listen(4000,()=>{
    console.log('server is running on port 4000!');
}) 