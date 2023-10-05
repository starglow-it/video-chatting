export enum UsersSocketEmitters {
    UpdateUser = 'users:updateUser',
    RemoveUser = 'users:removeUser',
    ChangeHost = 'users:changeHost',
    RequestRoleByHost = 'users:switchRole:host:request',
    AnswerRequestByHost = 'users:switchRole:host:answer',
    RequestRoleByLurker = 'users:switchRole:lurker:request',
    AnswerRequestByLurker = 'users:switchRole:lurker:answer',
}
