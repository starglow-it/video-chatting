export enum UsersSubscribeEvents {
    OnUpdateUsers = 'users:update',
    OnRemoveUsers = 'users:remove',
    OnUpdateUser = 'user:update',
    OnKickUser = 'users:kick',
    OnRequestSwitchRoleByHost = 'users:switchRole:host:request:receive',
    OnRequestSwitchRoleByAudience = 'users:switchRole:audience:request:receive',
    OnAnswerSwitchRoleByHost = 'users:switchRole:host:answer:receive',
    OnAnswerSwitchRoleByAudience = 'users:switchRole:audience:answer:receive',
    OnRequestSwitchFromParticipantToAudienceRoleByHost = 'users:switchRole:fromParticipant:toAudience:host:request:receive',
    OnRequestSwitchFromParticipantToAudienceRoleByParticipant = 'users:switchRole:fromParticipant:toAudience:participant:request:receive',
    OnAnswerSwitchFromParticipantToAudienceRoleByHost = 'users:switchRole:fromParticipant:toAudience:host:answer:receive',
    OnAnswerSwitchFromParticipantToAudienceRoleByParticipant = 'users:switchRole:fromParticipant:toAudience:participant:answer:receive',
}
