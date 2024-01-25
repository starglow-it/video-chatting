export enum UserEmitEvents {
  UpdateUser = 'user:update',
  UpdateUsers = 'users:update',
  RemoveUsers = 'users:remove',
  KickUsers = 'users:kick',
  RequestSwitchRoleByHost = 'users:switchRole:host:request:receive',
  RequestSwitchRoleByAudience = 'users:switchRole:audience:request:receive',
  AnswerSwitchRoleByHost = 'users:switchRole:host:answer:receive',
  AnswerSwitchRoleByAudience = 'users:switchRole:audience:answer:receive',
  RequestSwitchFromParticipantToAudienceRoleByHost = 'users:switchRole:fromParticipant:toAudience:host:request:receive',
  RequestSwitchFromParticipantToAudienceRoleByParticipant = 'users:switchRole:fromParticipant:toAudience:participant:request:receive',
  AnswerSwitchFromParticipantToAudienceRoleByHost = 'users:switchRole:fromParticipant:toAudience:host:answer:receive',
  AnswerSwitchFromParticipantToAudienceRoleByParticipant = 'users:switchRole:fromParticipant:toAudience:participant:answer:receive',
}
