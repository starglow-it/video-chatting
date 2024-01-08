export enum UserEmitEvents {
  UpdateUser = 'user:update',
  UpdateUsers = 'users:update',
  RemoveUsers = 'users:remove',
  KickUsers = 'users:kick',
  RequestSwitchRoleByHost = 'users:switchRole:host:request:receive',
  RequestSwitchRoleByLurker = 'users:switchRole:lurker:request:receive',
  AnswerSwitchRoleByHost = 'users:switchRole:host:answer:receive',
  AnswerSwitchRoleByLurker = 'users:switchRole:lurker:answer:receive',
  RequestSwitchFromParticipantToAudienceRoleByHost = 'users:switchRole:fromParticipant:toAudience:host:request:receive',
  RequestSwitchFromParticipantToAudienceRoleByParticipant = 'users:switchRole:fromParticipant:toAudience:participant:request:receive',
  AnswerSwitchFromParticipantToAudienceRoleByHost = 'users:switchRole:fromParticipant:toAudience:host:answer:receive',
  AnswerSwitchFromParticipantToAudienceRoleByParticipant = 'users:switchRole:fromParticipant:toAudience:participant:answer:receive',
}
