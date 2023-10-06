export enum UserEmitEvents {
  UpdateUser = 'user:update',
  UpdateUsers = 'users:update',
  RemoveUsers = 'users:remove',
  KickUsers = 'users:kick',
  RequestSwitchRoleByHost = 'users:switchRole:host:request:receive',
  RequestSwitchRoleByLurker = 'users:switchRole:lurker:request:receive',
  AnswerSwitchRoleByHost = 'users:switchRole:host:answer:receive',
  AnswerSwitchRoleByLurker = 'users:switchRole:lurker:answer:receive'
}
