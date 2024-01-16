import { response, errResponse, baseResponse } from "../../../config/response";

export const SuccessDTO = async() =>
    return response(baseResponse.SUCCESS);

export const userProfileDTO = async(UserProfileResponse, user_id) => {
    const changeClassof = Math.floor(UserProfileResponse.class_of / 100000 % 100);
    UserProfileResponse.class_of = changeClassof + "학번"

    const Response = {SuccessDTO, UserProfileResponse}
    return Response;
}