import { getUserAccountStatus } from "../src/app/user/userProvider"
import { baseResponse, errResponse, response } from "./response";


export const accountStatusMiddleware = async (req, res, next) => {

    const userEmail = req.verifiedToken.userEmail;

    if (await getUserAccountStatus(userEmail) == 0) {
        return res.send(errResponse(baseResponse.USERS_ACCOUNT_WITHDRAW));
    }

    if ([7, 30].includes(await getUserAccountStatus(userEmail))) {
        return res.send(errResponse(baseResponse.USERS_ACCOUNT_BLOCKED));
    }

    next();
}