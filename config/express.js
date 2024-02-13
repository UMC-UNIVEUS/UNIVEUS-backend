/*express Framework 설정만 해주는 파일 */
import express from "express";   
import cors from "cors";
import compression from "compression";
import methodOverride from "method-override";
import dotenv from "dotenv";
import userRouter from "../src/app/user/userRoute";
import postRouter from "../src/app/post/postRoute";
import mainRouter from "../src/app/main/mainRoute"
import reportRouter from "../src/app/report/reportRoute";
import profileRouter from "../src/app/profile/profileRoute";
import adminRouter from "../src/app/admin/adminRoute";
import cookieParser from "cookie-parser";


const app = express();  

dotenv.config();

app.use(cookieParser())
app.use(compression()); 
app.use(express.json());   
app.use(express.urlencoded({extended:true}));
app.use(methodOverride());
app.use(cors({credentials: true}));

app.set('views', './src/app/views');
app.set('view engine', 'ejs');

app.use('/user', userRouter);
app.use('/post',postRouter);
app.use('/report', reportRouter);
app.use('/profile', profileRouter);
app.use('/mypage', userRouter);
app.use('/', mainRouter)
app.use('/admin', adminRouter)

export default app;