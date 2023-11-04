import {isAdmin} from "../src/app/admin/adminProvider"
import { baseResponse, errResponse, response } from "./response";


export const adminMiddleware = async (req, res, next) => {

    const userEmail = req.verifiedToken.userEmail;
    if (!await isAdmin(userEmail)) return res.send(errResponse(baseResponse.NOT_ADMIN));

    next();
}