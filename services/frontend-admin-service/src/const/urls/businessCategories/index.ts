import {HttpMethods} from "shared-types";

import {serverUrl} from "../common";

export const getBusinessCategoriesUrl = ({ skip = 0, limit = 0 }) => ({
    url: `${serverUrl}/categories?skip=${skip}&limit=${limit}`,
    method: HttpMethods.Get,
});
