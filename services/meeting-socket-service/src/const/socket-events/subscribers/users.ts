export enum UsersSubscribeEvents {
  getUsers = 'users:getUsers',
  OnUpdateUser = 'users:updateUser',
  OnRemoveUser = 'users:removeUser',
  OnChangeHost = 'users:changeHost',
  OnRequestRoleByHost = 'users:switchRole:host:request:send',
  OnAnswerRequestByHost = 'users:switchRole:host:answer:send',
  OnRequestRoleByAudience = 'users:switchRole:audience:request:send',
  OnAnswerRequestByAudience = 'users:switchRole:audience:answer:send',
  OnRequestRoleFromParticipantToAudienceByHost = 'users:switchRole:fromParticipant:toAudience:host:request:send',
  OnAnswerRequestFromParticipantToAudienceByHost = 'users:switchRole:fromParticipant:toAudience:host:answer:send',
  OnRequestRoleFromParticipantToAudienceByParticipant = 'users:switchRole:fromParticipant:toAudience:participant:request:send',
  OnAnswerRequestFromParticipantToAudienceByParticipant = 'users:switchRole:fromParticipant:toAudience:participant:answer:send',
}
