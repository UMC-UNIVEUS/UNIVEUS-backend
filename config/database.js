/*데이터베이스 관련 설정만 해둔다, MySQL 연동을 위한 소스코드를 추가, 
쿼리문은 userDao에 작성한다. */

import dotenv from "dotenv";
import mysql from "mysql2/promise";
dotenv.config();


const pool = mysql.createPool({
    connectionLimit: 30,   
    host: `${process.env.DB_HOST}`, 
    user: `${process.env.DB_USER}`,  
    port: `${process.env.DB_PORT}`,
    password: `${process.env.DB_PASS}`,
    database: `${process.env.DB_NAME}`
});
export default pool;