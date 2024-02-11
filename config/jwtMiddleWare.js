import jwt from "jsonwebtoken";
import { baseResponse, errResponse } from "./response"


/** jwt 미들웨어 */
export const jwtMiddleware = (req, res, next) =>{
    /** 헤더에서 토큰 추출 */
    const token = req.headers['x-access-token']


    // token does not exist
    if(!token) {
        return res.send(errResponse(baseResponse.TOKEN_EMPTY))
    }

    /** 토큰 검증 */
    const p = new Promise(
        (resolve, reject) => {
            jwt.verify(token, process.env.ACCESS_TOKEN_SECRET , (err, verifiedToken) => {


                if(err) reject(err);
                resolve(verifiedToken)
            })
        }
    );

    /** 토큰 검증 실패 시 오류 발생*/
    const onError = (error) => {


        return res.send(errResponse(baseResponse.TOKEN_VERIFICATION_FAILURE))
    };
    /** 토큰 검증 성공 */
    p.then((verifiedToken) => {


        req.verifiedToken = verifiedToken;
                                
        next();
    }).catch(onError);
}
