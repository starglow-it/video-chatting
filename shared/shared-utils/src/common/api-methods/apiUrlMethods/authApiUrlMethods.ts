import {ApiScopes, HttpMethods} from "shared-types";
import {urlBuilder} from "../queryBuilder";

export class AuthApiUrlMethods {
    static scope = ApiScopes.Auth;
    static baseUrl = '';
    baseUrlInstance: URL;

    constructor() {
        this.baseUrlInstance = new URL('/', `${AuthApiUrlMethods.baseUrl}/${AuthApiUrlMethods.scope}`);
    }

    loginUserUrl() {
        const url = urlBuilder(this.baseUrlInstance, '/login');

        return {
            url,
            method: HttpMethods.Post,
        }
    }

    meUrl() {
        const url = urlBuilder(this.baseUrlInstance, '/me');

        return {
            url,
            method: HttpMethods.Get,
        }
    }

    refreshUrl() {
        const url = urlBuilder(this.baseUrlInstance, '/refresh');

        return {
            url,
            method: HttpMethods.Put,
        }
    }

    logoutProfileUrl() {
        const url = urlBuilder(this.baseUrlInstance, '/logout');

        return {
            url,
            method: HttpMethods.Delete,
        }
    }

    registerUserUrl() {
        const url = urlBuilder(this.baseUrlInstance, '/register');

        return {
            url,
            method: HttpMethods.Post,
        }
    }

    confirmRegisterUserUrl() {
        const url = urlBuilder(this.baseUrlInstance, '/confirm-registration');

        return {
            url,
            method: HttpMethods.Post,
        }
    }

    sendResetPasswordLinkUrl() {
        const url = urlBuilder(this.baseUrlInstance, '/reset-link');

        return {
            url,
            method: HttpMethods.Post,
        }
    }

    resetPasswordUrl() {
        const url = urlBuilder(this.baseUrlInstance, '/reset-password');

        return {
            url,
            method: HttpMethods.Post,
        }
    }

    checkResetPasswordLinkUrl() {
        const url = urlBuilder(this.baseUrlInstance, '/verify-reset-link');

        return {
            url,
            method: HttpMethods.Post,
        }
    }
}