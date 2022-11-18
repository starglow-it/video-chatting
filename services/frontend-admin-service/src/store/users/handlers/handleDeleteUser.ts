import {ErrorState } from "shared-types";
import {BlockUserParams} from "../../types";
import {sendRequest} from "../../../helpers/http/sendRequest";
import {deleteUserUrl} from "../../../const/urls/users";

export const handleDeleteUser = async ({ userId }: BlockUserParams): Promise<void> => {
    if (userId) {
        await sendRequest<void, ErrorState>(deleteUserUrl({
            userId,
        }));

        return;
    }

    return;
}