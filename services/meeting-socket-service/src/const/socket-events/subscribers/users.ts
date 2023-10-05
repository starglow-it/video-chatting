export enum UsersSubscribeEvents {
  OnUpdateUser = 'users:updateUser',
  OnRemoveUser = 'users:removeUser',
  OnChangeHost = 'users:changeHost',
  OnRequestRoleByHost = 'users:switchRole:host:request',
  OnAnswerRequestByHost = 'users:switchRole:host:answer',
  OnRequestRoleByLurker = 'users:switchRole:lurker:request',
  OnAnswerRequestByLurker = 'users:switchRole:lurker:answer',
}
