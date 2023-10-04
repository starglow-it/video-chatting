export enum UsersSubscribeEvents {
  OnUpdateUser = 'users:updateUser',
  OnRemoveUser = 'users:removeUser',
  OnChangeHost = 'users:changeHost',
  OnRequestRoleByHost = 'users:role:host:request',
  OnAnswerRequestByLurker = 'users:role:lurker:answer',
  OnRequestRoleByLurker = 'users:role:lurker:request',
  OnAnswerRoleByHost = 'users:role:host:answer',
}
