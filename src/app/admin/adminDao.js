/** email로 is_admin 조회 */
export const selectIsAdminByUserEmail = async(connection, userEmail) => {
    const selectIsAdminByUserEmailQuery = `SELECT is_admin FROM user WHERE email_id = '${userEmail}'`;
    const [selectIsAdminByUserEmailRow] = await connection.query(selectIsAdminByUserEmailQuery, userEmail);

    return selectIsAdminByUserEmailRow[0].is_admin;
};

export const selectUserInfoFromUser = async(connection) => {
    const selectAllFromUserQuery = `SELECT user_id, phone, nickname, class_of, major, email_id FROM user;`;
    const [selectAllFromUserRow] = await connection.query(selectAllFromUserQuery);

    return selectAllFromUserRow;
}

export const updateStatusByAdmin = async(connection, changeStatusByAdminParms)=>{// 게시글 상태 변경
    const updateStatusByAdminQuery = `
        UPDATE post 
        SET post_status = ?
        WHERE post_id = ?;
    `;
    const updateStatusByAdminRow = await connection.query(updateStatusByAdminQuery, changeStatusByAdminParms);
};

export const updateHiddenByAdmin = async(connection, changeHiddenByAdminParms)=>{// 게시글 상태 변경
    const updateHiddenByAdminQuery = `
        UPDATE post 
        SET hidden = ?
        WHERE post_id = ?;
    `;
    const updateHiddenByAdminRow = await connection.query(updateHiddenByAdminQuery, changeHiddenByAdminParms);
};

/** report된 유저 확인 */

export const selectUserReports = async(connection) => {
    const selectUserReportsQuery = `SELECT * FROM user_reports;`
    const [selectUserReportsRow] = await connection.query(selectUserReportsQuery);

    console.log(selectUserReportsRow)

    return selectUserReportsRow;
};
