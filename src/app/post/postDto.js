import {now} from "moment";

export const postPostResponseDTO = (Post,userIdFromJWT) => {

    return {
        "생성된 post_id": Post.insertId,
        "작성자의 user_id": userIdFromJWT
    };
}