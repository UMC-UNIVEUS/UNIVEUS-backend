import pool from "../../../config/database";
import { insertUser } from "../user/userDao" 
import {updateStatusByAdmin, updateHiddenByAdmin} from "./adminDao"


export const changeStatusByAdmin = async(post_status, post_id)=>{// 게시글 상태 변경

    const changeStatusByAdminParms = [post_status,post_id]
    const connection = await pool.getConnection(async conn => conn);
    const updateStatusByAdminResult = await updateStatusByAdmin(connection,changeStatusByAdminParms); 
    connection.release();
};

export const changeHiddenByAdmin = async(hidden, post_id)=>{// 게시글 상태 변경

    const changeHiddenByAdminParms = [hidden,post_id]
    const connection = await pool.getConnection(async conn => conn);
    const updateHiddenByAdminResult = await updateHiddenByAdmin(connection,changeHiddenByAdminParms); 
    connection.release();
};

/** 임의 회원가입 */
export const signUpByAdmin = async(userInfo) => {
    const connection = await pool.getConnection(async (conn) => conn);

    const userInfoParams = [ 
        userInfo.nickname,  
        userInfo.userEmail, 
        userInfo.gender,      
        userInfo.major,       
        userInfo.studentId,    
        userInfo.phoneNumber
      ];

    const insertUserResult = await insertUser(connection, userInfoParams)
    connection.release();
};
