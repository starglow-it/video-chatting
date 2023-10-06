export enum UsersSubscribeEvents {
    OnUpdateUsers = 'users:update',
    OnRemoveUsers = 'users:remove',
    OnUpdateUser = 'user:update',
    OnKickUser = 'users:kick',
    OnRequestSwitchRoleByHost = 'users:switchRole:host:request:receive',
    OnRequestSwitchRoleByLurker = 'users:switchRole:lurker:request:receive',
    OnAnswerSwitchRoleByHost = 'users:switchRole:host:answer:receive',
    OnAnswerSwitchRoleByLurker = 'users:switchRole:lurker:answer:receive',
}
