export const selectMainPageNotPaging = async(connection, category) => {
    const defaultQuery = `
    SELECT user.id AS user_id, user.nickname, user.gender, user.major, user.student_id, user.mebership, user.user_img,
           po.id AS post_id, po.title, po.category, po.limit_gender, po.meeting_datetime, po.location, po.current_people,
           po.limit_people, po.main_img, po.post_status
    FROM post AS po
    INNER JOIN user
    ON po.user_id = user.id
    ORDER BY po.created_at DESC LIMIT 30;`;

    const query = `
    SELECT user.id AS user_id, user.nickname, user.gender, user.major, user.student_id, user.mebership, user.user_img,
           po.id AS post_id, po.title, po.category, po.limit_gender, po.meeting_datetime, po.location, po.current_people,
           po.limit_people, po.main_img, po.post_status
    FROM (SELECT * FROM post WHERE category = ?) AS po
    INNER JOIN user
    ON po.user_id = user.id
    ORDER BY po.created_at DESC LIMIT 30;`;

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
    ORDER BY po.created_at DESC LIMIT 30;`;

    const query = `
    SELECT user.id AS user_id, user.nickname, user.gender, user.major, user.student_id, user.mebership, user.user_img,
           po.id AS post_id, po.title, po.category, po.limit_gender, po.meeting_datetime, po.location, po.current_people,
           po.limit_people, po.main_img, po.post_status
    FROM (SELECT * FROM post WHERE category = ?) AS po
    INNER JOIN user
    ON po.user_id = user.id
    WHERE po.created_at < (SELECT created_at FROM post WHERE id = ?) 
    ORDER BY po.created_at DESC LIMIT 30;`;

    if(params[0] === "전체") {
        const [rows] = await connection.query(defaultQuery, params[1]);
        return rows;
    }
    const [rows] = await connection.query(query, params);
    return rows;
}

export const selectPostByTitle = async(connection, params) => {

    const defaultQuery = `
    SELECT user.id AS user_id, user.nickname, user.gender, user.major, user.student_id, user.mebership, user.user_img,
           po.id AS post_id, po.title, po.category, po.limit_gender, po.meeting_datetime, po.location, po.current_people,
           po.limit_people, po.main_img, po.post_status
    FROM post AS po
    INNER JOIN user
    ON po.user_id = user.id
    WHERE title LIKE ? 
    ORDER BY po.created_at DESC LIMIT 30;`;

    const query = `
    SELECT user.id AS user_id, user.nickname, user.gender, user.major, user.student_id, user.mebership, user.user_img,
           po.id AS post_id, po.title, po.category, po.limit_gender, po.meeting_datetime, po.location, po.current_people,
           po.limit_people, po.main_img, po.post_status
    FROM post AS po
    INNER JOIN user
    ON po.user_id = user.id
    WHERE title LIKE ? AND po.created_at < (SELECT created_at FROM post WHERE id = ?) 
    ORDER BY po.created_at DESC LIMIT 30;`;

    if(params.length === 1) { // 페이징 x
        const [rows] = await connection.query(defaultQuery, params);
        return rows;
    }
    const [rows] = await connection.query(query, params);
    return rows;
}



/* 추후에 사용할 수도 있는 조건 정렬 기준
const newParams = [
        '%' + params[0] + '%',
        params[0],
        params[0] + '%',
        '%' + params[0] + '%',
        '%' + params[0],
    ];
SELECT user.id AS user_id, user.nickname, user.gender, user.major, user.student_id, user.membership, user.user_img,
       po.id AS post_id, po.title, po.category, po.limit_gender, po.meeting_datetime, po.location, po.current_people,
       po.limit_people, po.main_img, po.post_status
FROM post AS po
INNER JOIN user ON po.user_id = user.id
WHERE title LIKE ?
ORDER BY CASE
    WHEN title = ? THEN 0 // 정렬 기준 0순위
    WHEN title = ? THEN 1 // 정렬 기준 1순위
    WHEN title = ? THEN 2 // 정렬 기준 2순위
    WHEN title = ? THEN 3 // 정렬 기준 3순위
    ELSE 4 // 정렬 기준 4순위
END, po.created_at DESC
LIMIT 30;
*/