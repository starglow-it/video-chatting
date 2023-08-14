import { LoginTypes } from "shared-types";

export const USER_NOT_FOUND = { message: 'usund', errorCode: 100 };
export const USER_EXISTS = { message: 'user.exits', errorCode: 101 };
export const INVALID_CREDENTIALS = {
  message: 'user.credentials.invalid',
  errorCode: 102,
};
export const SAME_PASSWORD = {
  message: 'user.pass.newPassword.samePassword',
  errorCode: 103,
};
export const NOT_MATCH_PASSWORD = {
  message: 'user.pass.newPassword.notMatch',
  errorCode: 104,
};
export const SAME_RESET_PASSWORD = {
  message: 'user.pass.newResetPassword.samePassword',
  errorCode: 105,
};
export const INVALID_PASSWORD = {
  message: 'user.pass.invalid',
  errorCode: 106,
};
export const USER_NOT_CONFIRMED = {
  message: 'user.notConfirmed',
  errorCode: 107,
};

export const USER_IS_BLOCKED = {
  message: 'user.isBlocked',
  errorCode: 108,
};

export const USER_NOT_GOOGLE_ACCOUNT = {
  message: 'user.notGoogleAccount',
  errorCode: 110
}

//#region functionals
const PlatformErrorCode: { [K in LoginTypes]: number } = {
  'local': 111,
  'google': 112
}

export const userLoginOtherPlatform = (platform: LoginTypes) => ({ message: `user.register.${platform}`, errorCode: PlatformErrorCode[platform] });
//#endregion