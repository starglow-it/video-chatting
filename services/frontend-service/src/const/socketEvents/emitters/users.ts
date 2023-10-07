export enum UsersSocketEmitters {
    UpdateUser = 'users:updateUser',
    RemoveUser = 'users:removeUser',
    ChangeHost = 'users:changeHost',
    RequestRoleByHost = 'users:switchRole:host:request:send',
    AnswerRequestByHost = 'users:switchRole:host:answer:send',
    RequestRoleByLurker = 'users:switchRole:lurker:request:send',
    AnswerRequestByLurker = 'users:switchRole:lurker:answer:send',
}
