export const selectMainPageNotPaging = async(connection, category) => {
    const defaultQuery = `
    SELECT user.id AS user_id, user.nickname, user.gender, user.major, user.student_id, user.mebership, user.user_img,
           po.id AS post_id, po.title, po.category, po.limit_gender, po.meeting_datetime, po.location, po.current_people,
           po.limit_people, po.main_img, po.post_status
    FROM post AS po
    INNER JOIN user
    ON po.user_id = user.id
    ORDER BY po.created_at DESC LIMIT 20;`;

    const query = `
    SELECT user.id AS user_id, user.nickname, user.gender, user.major, user.student_id, user.mebership, user.user_img,
           po.id AS post_id, po.title, po.category, po.limit_gender, po.meeting_datetime, po.location, po.current_people,
           po.limit_people, po.main_img, po.post_status
    FROM (SELECT * FROM post WHERE category = ?) AS po
    INNER JOIN user
    ON po.user_id = user.id
    ORDER BY po.created_at DESC LIMIT 20;`;

    if(category === "전체") {
        const [rows] = await connection.query(defaultQuery, category);
        return rows;
    }
    const [rows] = await connection.query(query, category);
    return rows;
}

export const selectMainPage = async(connection, params) => {
    const defaultQuery = `
    SELECT user.id AS user_id, user.nickname, user.gender, user.major, user.student_id, user.mebership, user.user_img,
           po.id AS post_id, po.title, po.category, po.limit_gender, po.meeting_datetime, po.location, po.current_people,
           po.limit_people, po.main_img, po.post_status
    FROM post AS po
    INNER JOIN user
    ON po.user_id = user.id
    WHERE po.created_at < (SELECT created_at FROM post WHERE id = ?) 
    ORDER BY po.created_at DESC LIMIT 20;`;

    const query = `
    SELECT user.id AS user_id, user.nickname, user.gender, user.major, user.student_id, user.mebership, user.user_img,
           po.id AS post_id, po.title, po.category, po.limit_gender, po.meeting_datetime, po.location, po.current_people,
           po.limit_people, po.main_img, po.post_status
    FROM (SELECT * FROM post WHERE category = ?) AS po
    INNER JOIN user
    ON po.user_id = user.id
    WHERE po.created_at < (SELECT created_at FROM post WHERE id = ?) 
    ORDER BY po.created_at DESC LIMIT 20;`;

    if(params[0] === "전체") {
        const [rows] = await connection.query(defaultQuery, params[1]);
        return rows;
    }
    const [rows] = await connection.query(query, params);
    return rows;
}