export enum UserEmitEvents {
  UpdateUser = 'user:update',
  UpdateUsers = 'users:update',
  RemoveUsers = 'users:remove',
  KickUsers = 'users:kick',
  RequestSwitchRoleByHost = 'users:switchRole:host:request',
  RequestSwitchRoleByLurker = 'users:switchRole:lurker:request',
  AnswerSwitchRoleByHost = 'users:switchRole:host:answer',
  AnswerSwitchRoleByLurker = 'users:switchRole:lurker:answer'
}
