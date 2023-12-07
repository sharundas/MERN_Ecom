import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRouter from './routes/user.route.js';
import authRouter from './routes/auth.route.js'
import cookieParser from 'cookie-parser';
import cors from 'cors';
import listingRouter from './routes/listing.route.js'


dotenv.config();

mongoose.connect(process.env.MONGO).then(() => {
  console.log('connected to MongoDB');
}).catch((err) => {
  console.log(err);
})

const app = express();

app.use(express.json());

app.use(cookieParser());

app.listen(3000,() => {
  console.log('Server is running on port 3000')

 
});

 
app.use("/api/user", userRouter);
app.use("/api/auth",authRouter);
app.use("/api/listing",listingRouter );



//middleware

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server error';
  return res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
})

app.use(cors());

// app.get('/test' , (req,res) => {
//   res.send('Hello World');
// })

// sharun  pass - rFqRpvW3eyFVjOKh

