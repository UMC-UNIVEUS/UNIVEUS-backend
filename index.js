import dotenv from "dotenv";
import app from './config/express'
import { Server } from "socket.io"; // 웹 소켓
import { createServer } from "http";

dotenv.config();

const httpServer = createServer(app);// app에 있는 DB 연결 부분을 올린다.

// io는 input/ouput의 줄임말로 웹 소켓의 국룰인 이름이다.
const io = new Server(httpServer,{ // 웹 소켓 서버 생성
    cors:{ // 웹 소켓도 app.jsx 처럼 cors 설정을 해줘야 한다. 허락한 대상만 통신할 수 있도록
        origin: "http://localhost:3000" // 프론트엔드 주소
    },
});

import ioHandler from "./config/io";
import {jwtMiddleware} from "./config/jwtMiddleWare"; // io 매개변수를 io.js에서 가져옴
ioHandler(jwtMiddleware,io);

httpServer.listen(process.env.SERVER_PORT, ()=>{ // 앱 서버
    console.log("Server listening on port:", process.env.SERVER_PORT)
});



