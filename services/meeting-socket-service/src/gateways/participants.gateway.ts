import {
    ConnectedSocket,
    MessageBody,
    WebSocketGateway,
} from '@nestjs/websockets';
import { Connection } from 'mongoose';
import { InjectConnection } from '@nestjs/mongoose';
import { Socket } from 'socket.io';

// gateways

// types
import {
    AnswerSwitchRoleAction,
    MeetingAccessStatusEnum,
    MeetingRole,
    MeetingSoundsEnum,
} from 'shared-types';

// services
import { MeetingsService } from '../modules/meetings/meetings.service';

// dtos
import { userSerialization } from '../dtos/response/common-user.dto';
import { meetingSerialization } from '../dtos/response/common-meeting.dto';

// helpers
import { withTransaction } from '../helpers/mongo/withTransaction';

// const
import { MeetingUserDocument } from '../schemas/meeting-user.schema';
import { subscribeWsError, throwWsError, wsError } from '../utils/ws/wsError';
import { SwitchRoleByHostRequestDto } from '../dtos/requests/users/request-switch-role-by-host.dto';
import { wsResult } from '../utils/ws/wsResult';
import { AnswerSwitchRoleByLurkerRequestDto } from '../dtos/requests/users/answer-switch-role-by-lurker.dto';
import { SwitchRoleByLurkerRequestDto } from '../dtos/requests/users/request-switch-role-by-lurker.dto';
import { MeetingDocument } from '../schemas/meeting.schema';
import { ObjectId } from '../utils/objectId';
import { AnswerSwitchRoleByHostRequestDto } from '../dtos/requests/users/answer-switch-role-by-host.dto';
import { UsersService } from '../modules/users/users.service';
import { UsersSubscribeEvents } from '../const/socket-events/subscribers';
import {
    MeetingEmitEvents,
    UserEmitEvents,
} from '../const/socket-events/emitters';
import { CoreService } from '../services/core/core.service';
import { UserActionInMeeting } from '../types';
import { BaseGateway } from './base.gateway';
import { UsersComponent } from '../modules/users/users.component';
import { WsEvent } from '../utils/decorators/wsEvent.decorator';
import { MeetingI18nErrorEnum, MeetingNativeErrorEnum } from 'shared-const';

type TRequestSwitchRoleParams = {
    meetingUser: MeetingUserDocument;
    socketEmitterId: string;
    meeting: MeetingDocument;
    emitterEvent: string;
};

type TAnswerSwitchRoleParams = {
    action: AnswerSwitchRoleAction;
} & TRequestSwitchRoleParams;

@WebSocketGateway({
    transports: ['websocket'],
    cors: {
        origin: '*',
    },
})
export class ParticipantsGateway extends BaseGateway {
    constructor(
        private readonly meetingsService: MeetingsService,
        private readonly usersService: UsersService,
        private readonly usersComponent: UsersComponent,
        private readonly coreService: CoreService,
        @InjectConnection() private connection: Connection,
    ) {
        super();
    }

    async sendSwitchRoleFromParticipantToAudienceRequest({
        meetingUser,
        meeting,
        emitterEvent,
        socketEmitterId,
    }: TRequestSwitchRoleParams) {
        await meeting.populate('users');
        const plainMeeting = meetingSerialization(meeting);
        const plainUsers = userSerialization(meeting.users);
        const plainUser = userSerialization(meetingUser);

        this.emitToSocketId(socketEmitterId, emitterEvent, {
            user: plainUser,
            meeting: plainMeeting,
        });
        
        return wsResult({
            meeting: plainMeeting,
            users: plainUsers,
        });
    }

    @WsEvent(UsersSubscribeEvents.OnRequestRoleFromParticipantToAudienceByParticipant)
    async requestSwitchRoleFromParticipantToAudienceByParticipant(
        @ConnectedSocket() socket: Socket,
        @MessageBody() msg: SwitchRoleByLurkerRequestDto,
    ) {
        return withTransaction(
            this.connection,
            async (session) => {
                const { meetingId } = msg;
                subscribeWsError(socket);
                const meetingUser = await this.usersComponent.findOneAndUpdate({
                    query: {
                        socketId: socket.id,
                        meetingRole: MeetingRole.Participant,
                    },
                    data: {
                        accessStatus: MeetingAccessStatusEnum.SwitchRoleSent,
                    },
                    session,
                });

                const meeting = await this.meetingsService.findById({
                    id: meetingId,
                    session,
                });
                throwWsError(!meeting, MeetingNativeErrorEnum.MEETING_NOT_FOUND);

                const host = await this.usersComponent.findOne({
                    query: {
                        _id: meeting.hostUserId,
                    },
                    session,
                });

                this.emitToSocketId(host?.socketId, MeetingEmitEvents.PlaySound, {
                    soundType: MeetingSoundsEnum.NewAttendee,
                });

                return await this.sendSwitchRoleFromParticipantToAudienceRequest({
                    meetingUser,
                    meeting,
                    emitterEvent: UserEmitEvents.RequestSwitchFromParticipantToAudienceRoleByParticipant,
                    socketEmitterId: host.socketId,
                });
            },
            {
                onFinaly: (err) => wsError(socket, err),
            },
        );
    }

    @WsEvent(UsersSubscribeEvents.OnRequestRoleFromParticipantToAudienceByHost)
    async requestSwitchRoleFromParticipantToAudienceByHost(
        @ConnectedSocket() socket: Socket,
        @MessageBody() msg: SwitchRoleByHostRequestDto,
    ) {
        return withTransaction(
            this.connection,
            async (session) => {
                const { meetingId, meetingUserId } = msg;
                subscribeWsError(socket);
                
                const meetingUser = await this.usersService.findOne({
                    query: {
                        _id: new ObjectId(meetingUserId),
                        meetingRole: MeetingRole.Participant,
                    },
                    session,
                });
                
                const meeting = await this.meetingsService.findById({
                    id: meetingId,
                    session,
                });
                
                throwWsError(!meeting, MeetingNativeErrorEnum.MEETING_NOT_FOUND);

                await this.usersComponent.findOne({
                    query: {
                        _id: meeting.hostUserId,
                        accessStatus: MeetingAccessStatusEnum.InMeeting,
                    },
                    session,
                });

                return await this.sendSwitchRoleFromParticipantToAudienceRequest({
                    meeting,
                    meetingUser,
                    emitterEvent: UserEmitEvents.RequestSwitchFromParticipantToAudienceRoleByHost,
                    socketEmitterId: meetingUser.socketId,
                });
            },
            {
                onFinaly: (err) => wsError(socket, err),
            },
        );
    }

    async answerSwitchRoleRequest({
        meeting,
        meetingUser,
        socketEmitterId,
        emitterEvent,
        action,
    }: TAnswerSwitchRoleParams) {
        await meeting.populate('users');
        const plainMeeting = meetingSerialization(meeting);
        const plainUser = userSerialization(meetingUser);
        const plainUsers = userSerialization(meeting.users);
        if (action === AnswerSwitchRoleAction.Accept) {
            const userSocket = await this.getSocket(
                `lurker:${plainMeeting.id}`,
                plainUser.socketId,
            );

            userSocket?.leave(`lurker:${plainMeeting.id}`);
        }

        this.emitToSocketId(socketEmitterId, emitterEvent, {
            meeting: plainMeeting,
            users: plainUsers,
            user: plainUser,
            action,
        });

        const emitMeetingUpdated = {
            meeting: plainMeeting,
            users: plainUsers,
        };

        this.emitToRoom(
            `meeting:${meeting._id}`,
            MeetingEmitEvents.UpdateMeeting,
            emitMeetingUpdated,
        );

        this.emitToRoom(
            `waitingRoom:${meeting.templateId}`,
            MeetingEmitEvents.UpdateMeeting,
            emitMeetingUpdated,
        );

        return wsResult({
            meeting: plainMeeting,
            user: plainUser,
            users: plainUsers,
            action,
        });
    }

    @WsEvent(UsersSubscribeEvents.OnAnswerRequestFromParticipantToAudienceByHost)
    async answerSwitchRoleFromParticipantToAudienceByHost(
        @ConnectedSocket() socket: Socket,
        @MessageBody()
        { action, meetingUserId, meetingId }: AnswerSwitchRoleByHostRequestDto,
    ) {
        return withTransaction(
            this.connection,
            async (session) => {
                subscribeWsError(socket);
                const meeting = await this.meetingsService.findById({
                    id: meetingId,
                    session,
                });
                throwWsError(!meeting, MeetingNativeErrorEnum.MEETING_NOT_FOUND);

                const user = await this.usersComponent.findOne({
                    query: {
                        _id: new ObjectId(meetingUserId),
                        meetingRole: MeetingRole.Participant,
                        accessStatus: {
                            $in: [MeetingAccessStatusEnum.SwitchRoleSent],
                        },
                    },
                    session,
                });

                const updateData = {
                    accessStatus: MeetingAccessStatusEnum.InMeeting,
                };

                if (action === AnswerSwitchRoleAction.Accept) {
                    const userTemplate = await this.coreService.findMeetingTemplateById({
                        id: meeting.templateId,
                    });

                    throwWsError(!userTemplate, 'User template not found');

                    const u = await this.usersService.updateVideoContainer({
                        userTemplate,
                        userId: user._id.toString(),
                        event: UserActionInMeeting.Leave,
                    });

                    throwWsError(!u, MeetingI18nErrorEnum.MAX_PARTICIPANTS_NUMBER);

                    Object.assign(updateData, {
                        meetingRole: MeetingRole.Audience,
                        userPosition: u.position,
                        userSize: u.size,
                        isAuraActive: false,
                    });
                }

                const userUpdated = await this.usersComponent.findOneAndUpdate({
                    query: {
                        _id: user._id,
                    },
                    data: updateData,
                    session,
                });

                const meetingUpdated =
                    await this.usersComponent.findMeetingFromPopulateUser(userUpdated);

                return await this.answerSwitchRoleRequest({
                    meeting: meetingUpdated,
                    meetingUser: userUpdated,
                    action,
                    emitterEvent: UserEmitEvents.AnswerSwitchFromParticipantToAudienceRoleByHost,
                    socketEmitterId: userUpdated.socketId,
                });
            },
            {
                onFinaly: (err) => wsError(socket, err),
            },
        );
    }

    @WsEvent(UsersSubscribeEvents.OnAnswerRequestFromParticipantToAudienceByParticipant)
    async answerSwitchRoleFromParticipantToAudienceByParticipant(
        @ConnectedSocket() socket: Socket,
        @MessageBody() { action, meetingId }: AnswerSwitchRoleByLurkerRequestDto,
    ) {
        return withTransaction(
            this.connection,
            async (session) => {
                subscribeWsError(socket);
                const meeting = await this.meetingsService.findById({
                    id: meetingId,
                    session,
                });
                throwWsError(!meeting, MeetingNativeErrorEnum.MEETING_NOT_FOUND);

                const user = await this.usersComponent.findOne({
                    query: {
                        socketId: socket.id,
                        meetingRole: MeetingRole.Participant,
                    },
                    session,
                });

                const updateData = {};

                if (action === AnswerSwitchRoleAction.Accept) {
                    const userTemplate = await this.coreService.findMeetingTemplateById({
                        id: meeting.templateId,
                    });

                    throwWsError(!userTemplate, 'User template not found');

                    const u = await this.usersService.updateVideoContainer({
                        userTemplate,
                        userId: user._id.toString(),
                        event: UserActionInMeeting.Join,
                    });

                    throwWsError(!u, MeetingI18nErrorEnum.MAX_PARTICIPANTS_NUMBER);

                    Object.assign(updateData, {
                        meetingRole: MeetingRole.Audience,
                        userPosition: u.position,
                        userSize: u.size,
                        isAuraActive: false,
                    });
                }

                const userUpdated = await this.usersComponent.findOneAndUpdate({
                    query: {
                        _id: user._id,
                    },
                    data: updateData,
                    session,
                });

                const host = await this.usersComponent.findOne({
                    query: {
                        _id: meeting.hostUserId,
                    },
                    session,
                });

                const meetingUpdated =
                    await this.usersComponent.findMeetingFromPopulateUser(userUpdated);

                return await this.answerSwitchRoleRequest({
                    meeting: meetingUpdated,
                    meetingUser: userUpdated,
                    action,
                    emitterEvent: UserEmitEvents.AnswerSwitchFromParticipantToAudienceRoleByParticipant,
                    socketEmitterId: host.socketId,
                });
            },
            {
                onFinaly: (err) => wsError(socket, err),
            },
        );
    }
}
