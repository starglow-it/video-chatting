export enum UserBrokerPatterns {
  CreateUser = 'create_user',
  FindUserByEmail = 'find_user_by_email',
  FindUserByEmailAndUpdate = 'find_user_by_email_and_update',
  FindUserById = 'find_user_by_id',
  FindUsersById = 'find_users_by_id',
  FindUser = 'find_user',
  UpdateUser = 'update_user',
  UserExists = 'user_exists',
  UserTokenExists = 'user_token_exists',
  VerifyPassword = 'verify_password',
  ComparePasswords = 'compare_passwords',
  UpdatePassword = 'update_password',
  UpdateProfile = 'update_profile',
  DeleteProfile = 'delete_profile',
  UpdateProfileAvatar = 'update_profile_avatar',
  DeleteProfileAvatar = 'delete_profile_avatar',
  SetVerificationCode = 'set_verification_code',
  ValidateVerificationCode = 'validate_verification_code',
  ResetPassword = 'reset_password',
  CountUsers = 'count_users',
  FindUsers = 'find_users',
  ResetTrialNotification = 'reset_trial_notification',
  SearchUsers = 'search_users',
  ManageUserRights = 'manage_user_rights',
}
