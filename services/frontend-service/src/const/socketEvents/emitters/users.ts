export enum UsersSocketEmitters {
    UpdateUser = 'users:updateUser',
    GetStatistics = 'users:get:statistics',
    RemoveUser = 'users:removeUser',
    ChangeHost = 'users:changeHost',
    RequestRoleByHost = 'users:switchRole:host:request:send',
    AnswerRequestByHost = 'users:switchRole:host:answer:send',
    RequestRoleByAudience = 'users:switchRole:audience:request:send',
    AnswerRequestByAudience = 'users:switchRole:audience:answer:send',
    RequestRoleFromParticipantToAudienceByHost = 'users:switchRole:fromParticipant:toAudience:host:request:send',
    AnswerRequestFromParticipantToAudienceByHost = 'users:switchRole:fromParticipant:toAudience:host:answer:send',
    RequestRoleFromParticipantToAudienceByParticipant = 'users:switchRole:fromParticipant:toAudience:participant:request:send',
    AnswerRequestFromParticipantToAudienceByParticipant = 'users:switchRole:fromParticipant:toAudience:participant:answer:send',
}
