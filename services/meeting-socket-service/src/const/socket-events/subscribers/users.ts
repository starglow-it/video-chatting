export enum UsersSubscribeEvents {
  OnUpdateUser = 'users:updateUser',
  OnRemoveUser = 'users:removeUser',
  OnChangeHost = 'users:changeHost',
  OnRequestRoleByHost = 'users:switchRole:host:request:send',
  OnAnswerRequestByHost = 'users:switchRole:host:answer:send',
  OnRequestRoleByLurker = 'users:switchRole:lurker:request:send',
  OnAnswerRequestByLurker = 'users:switchRole:lurker:answer:send',
}
