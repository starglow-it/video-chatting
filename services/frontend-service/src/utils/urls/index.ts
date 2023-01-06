import { ApiUrlManager } from "shared-utils";
import {ApiScopes} from "shared-types";

import { serverUrl } from './baseData';

export * from './templatesUrls';
export * from './otherUrls';
export * from './payments';
export * from './clientUrls';
export * from './businessCategories';

const apiManager = new ApiUrlManager(serverUrl);

const AuthApiMethods = apiManager.getApiScopeUrlsMethods(ApiScopes.Auth);
const MeetingApiMethods = apiManager.getApiScopeUrlsMethods(ApiScopes.Meetings);
const ProfileApiMethods = apiManager.getApiScopeUrlsMethods(ApiScopes.Profile);
const TemplatesApiMethods = apiManager.getApiScopeUrlsMethods(ApiScopes.Templates);

export const authApiMethods = new AuthApiMethods();
export const meetingsApiMethods = new MeetingApiMethods();
export const profileApiMethods = new ProfileApiMethods();
export const templatesApiMethods = new TemplatesApiMethods();
