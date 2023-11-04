import dotenv from "dotenv";
import app from './config/express'

dotenv.config();

app.listen(process.env.SERVER_PORT,()=>{
    console.log(`Server is running on port ${process.env.SERVER_PORT}.`);
})


