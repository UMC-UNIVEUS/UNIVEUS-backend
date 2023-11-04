import { isUser, isAuthNumber, isAuthUser } from "../src/app/user/userProvider"
import { baseResponse, errResponse, response } from "./response";


export const authUserMiddleware = async (req, res, next) => {

    const userEmail = req.verifiedToken.userEmail;

    if (!await isUser(userEmail)) {
        createUser(userEmail);
        return res.send(errResponse(baseResponse.LOGIN_NOT_USER));
    }

    if (!await isAuthNumber(userEmail)) {
        return res.send(errResponse(baseResponse.LOGIN_NOT_AUTH_NUMBER));
    }

    if (!await isAuthUser(userEmail)) {
        return res.send(errResponse(baseResponse.LOGIN_NOT_AUTH_COMPLETE_USER));
    }

    next();
}