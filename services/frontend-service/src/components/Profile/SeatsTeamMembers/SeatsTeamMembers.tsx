import { memo, useEffect, useState, useCallback } from 'react';
import { useStore } from 'effector-react';

import {
    appDialogsApi,
} from 'src/store';
import { AppDialogsEnum } from 'src/store/types';

//custom components
import { CustomPaper } from '@library/custom/CustomPaper/CustomPaper';
import { CustomGrid } from 'shared-frontend/library/custom/CustomGrid';
import { CustomTypography } from '@library/custom/CustomTypography/CustomTypography';
import { ActionButton } from 'shared-frontend/library/common/ActionButton';
import { Translation } from '@library/common/Translation/Translation';
import { CustomButton } from 'shared-frontend/library/custom/CustomButton';

//@mui
import Button from '@mui/material/Button';
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';

//fontawesome icon
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrashCan } from '@fortawesome/free-solid-svg-icons'

//store
import {
    $profileStore,
    updateProfileFx,
    setProfileEvent,
    addNotificationEvent,
    deleteSeatTeamMemberFx,
    removeTeamMemberFromHostFx
} from '../../../store';
import { NotificationType } from '../../../store/types';

import { handleSendEmailToInviteNewTeamMember } from 'src/store/templates/handlers/handleSendEmailToInviteNewTeamMember';

//const
import { PlanKeys } from 'shared-types';

// @mui
import { InputBase } from '@mui/material';

//styles
import styles from './SeatsTeamMembers.module.scss';
import { ConditionalRender } from 'shared-frontend/library/common/ConditionalRender';

const Component = () => {
    const profile = useStore($profileStore);
    const [teamMembers, setTeamMembers] = useState([]);
    const [profileTeamMembers, setProfileTeamMembers] = useState([]);
    const isSubscriptionBusiness = profile.subscriptionPlanKey === PlanKeys.Business;

    useEffect(() => {
        setProfileTeamMembers(profile.teamMembers);
    }, [profile.teamMembers]);

    const handleAddMember = useCallback(() => {
        if (isSubscriptionBusiness && !profile.teamOrganization?.name) {
            if (teamMembers.length + profile.teamMembers.length < profile.maxSeatNumForTeamMembers) {
                setTeamMembers([...teamMembers, { email: '', valid: false }]);
            } else {
                appDialogsApi.openDialog({
                    dialogKey: AppDialogsEnum.payToAddNewTeamMemberDialog,
                });
            }
        }
    }, [
        profile,
        isSubscriptionBusiness,
        teamMembers
    ]);

    const handleLeaveTeam = async () => {
        try {
            const orgEmails = profile.teamMembers.map(tm => tm.email);
            const result = await updateProfileFx({
                teamMembers: [],
                teamOrganization: null,
                subscriptionPlanKey: PlanKeys.House,
            });

            if (!Boolean(result?.error) && orgEmails.length) {
                await removeTeamMemberFromHostFx({ orgEmails, memberEmail: result?.profile?.email });
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handleRemoveMember = (index) => {
        const updatedMembers = [...teamMembers];
        updatedMembers.splice(index, 1);
        setTeamMembers(updatedMembers);
    };

    const handleRemoveMemberFromProfile = async (email) => {
        try {
            profile.teamMembers = profile.teamMembers.filter(member => member.email !== email);
            const result = await deleteSeatTeamMemberFx({ email });

            if (result) {
                await updateProfileFx({ teamMembers: profile.teamMembers });

                addNotificationEvent({
                    type: NotificationType.TeamMemberRemoved,
                    message: 'successfully removed',
                });
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handleRemovePendingMember = async email => {
        try {
            const updatedMembers = profile.teamMembers.filter(member => member.email !== email);
            setProfileEvent({
                user: {
                    teamMembers: updatedMembers
                }
            });
            await updateProfileFx({ teamMembers: updatedMembers });
        } catch (error) {
            console.error(error);
        }
    };

    const handleEmailChange = (index, value) => {
        const updatedMembers = [...teamMembers];
        updatedMembers[index].email = value;
        updatedMembers[index].valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
        setTeamMembers(updatedMembers);
    };

    const handleSendInvitation = async (index) => {
        try {
            if (teamMembers[index].email) {
                const result = await handleSendEmailToInviteNewTeamMember(
                    {
                        email: teamMembers[index].email,
                        hostEmail: profile.email,
                        seat: profile.teamMembers.length >= 3 ? 'subscription' : 'free'
                    });
                if (result.success) {
                    handleRemoveMember(index);
                    setProfileEvent({
                        user: {
                            teamMembers: [...profile.teamMembers,
                            {
                                email: teamMembers[index].email,
                                seat: profile.teamMembers.length >= 3 ? 'subscription' : 'free',
                                role: 'team member',
                                status: 'pending'
                            }
                            ]
                        }
                    });
                } else {
                    if (result.message) {
                        addNotificationEvent({
                            type: NotificationType.SendTeamMemberInvitationError,
                            message: result.message,
                        });
                    }
                }
            }
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <CustomPaper className={styles.personalInfoWrapper}>
            <CustomGrid container marginBottom={2} justifyContent="space-between">
                <CustomGrid
                    item
                >
                    <CustomGrid item>
                        <PersonAddAlt1Icon
                            className={styles.favoriteIcon}
                            width="24px"
                            height="24px"
                        />
                        <CustomTypography
                            variant="body1"
                            fontWeight="600"
                            nameSpace="profile"
                            translation="seatsTeamMembers.title"
                        />
                    </CustomGrid>
                    <CustomTypography
                        sx={{ fontSize: '12px' }}
                        color='#D9D9D9'
                        component="div"
                    >
                        {
                            profile.teamOrganization?.name || profile.companyName || 'no name'
                        }
                    </CustomTypography>
                </CustomGrid>

                {
                    !profile.teamOrganization?.name
                        ? (
                            <CustomButton
                                onClick={handleAddMember}
                                disabled={!isSubscriptionBusiness}
                                variant="custom-primary"
                                label={
                                    <Translation
                                        nameSpace="profile"
                                        translation="seatsTeamMembers.inviteTeamMembers"
                                    />
                                }
                                sx={{ width: '160px', marginBottom: '10px', padding: "10px" }}
                            />
                        )
                        : (
                            <CustomButton
                                onClick={handleLeaveTeam}
                                variant="custom-primary"
                                label={
                                    <Translation
                                        nameSpace="profile"
                                        translation="seatsTeamMembers.leaveTeam"
                                    />
                                }
                                sx={{ width: '160px', marginBottom: '10px', padding: "10px" }}
                            />
                        )
                }
            </CustomGrid>
            <CustomGrid
                container
                flexDirection="column"
                className={styles.recordingListInnerWrapper}
                gap={1.5}
            >

                <ConditionalRender condition={!isSubscriptionBusiness}>
                    <CustomTypography
                        variant="body1"
                        color="error"
                        nameSpace="profile"
                        translation="seatsTeamMembers.upgratePlanToBusiness"
                    />
                </ConditionalRender>
                <ConditionalRender condition={isSubscriptionBusiness}>
                    <CustomGrid
                        container
                        flexDirection="row"
                        align-items="center"
                    >

                        <CustomGrid
                            item
                            xs={3}
                            sx={{ textAlign: 'left' }}
                        >
                            <CustomTypography
                                sx={{ fontSize: '12px' }}
                                fontWeight="600"
                                nameSpace="profile"
                                translation="seatsTeamMembers.email"
                            />
                        </CustomGrid>
                        <CustomGrid
                            item
                            xs={2}
                            sx={{ textAlign: 'center' }}
                        >
                            <CustomTypography
                                sx={{ fontSize: '12px' }}
                                fontWeight="600"
                                nameSpace="profile"
                                translation="seatsTeamMembers.role"
                            />
                        </CustomGrid>
                        {
                            !profile.teamOrganization?.name && (
                                <>
                                    <CustomGrid
                                        item
                                        xs={2}
                                        sx={{ textAlign: 'center' }}
                                    >
                                        <CustomTypography
                                            sx={{ fontSize: '12px' }}
                                            fontWeight="600"
                                            nameSpace="profile"
                                            translation="seatsTeamMembers.status"
                                        />
                                    </CustomGrid>
                                    <CustomGrid
                                        item
                                        xs={1}
                                        sx={{ textAlign: 'center' }}
                                    >
                                        <CustomTypography
                                            sx={{ fontSize: '12px' }}
                                            fontWeight="600"
                                            nameSpace="profile"
                                            translation="seatsTeamMembers.seat"
                                        />
                                    </CustomGrid></>
                            )
                        }
                        <CustomGrid
                            item
                            xs={2}
                            sx={{ textAlign: 'center' }}
                        >
                            <CustomTypography
                                sx={{ fontSize: '12px' }}
                                fontWeight="600"
                                nameSpace="profile"
                                translation="seatsTeamMembers.subscriptionType"
                            />
                        </CustomGrid>
                        {
                            !profile.teamOrganization?.name && (
                                <CustomGrid
                                    item
                                    xs={2}
                                    sx={{ textAlign: 'center' }}
                                >
                                    <CustomTypography
                                        sx={{ fontSize: '12px' }}
                                        fontWeight="600"
                                        nameSpace="profile"
                                        translation="seatsTeamMembers.removeUser"
                                    />
                                </CustomGrid>
                            )
                        }
                    </CustomGrid>
                    {
                        !profile.teamOrganization?.name && (
                            <CustomGrid container item spacing={2} alignItems="center">
                                <CustomGrid item xs={3} className={styles.activeEmailWrapper}>
                                    <CustomTypography
                                        sx={{ fontSize: '12px' }}
                                        color='#D9D9D9'
                                    >{profile.email}</CustomTypography>
                                </CustomGrid>
                                <CustomGrid item xs={2} container justifyContent="center">
                                    <CustomTypography
                                        sx={{ fontSize: '12px' }}

                                        color='#D9D9D9'
                                    >
                                        admin
                                    </CustomTypography>
                                </CustomGrid>
                                <CustomGrid item container xs={2} justifyContent="center">
                                    <CustomTypography
                                        sx={{ fontSize: '12px' }}
                                        nameSpace="profile"
                                        translation="seatsTeamMembers.active"
                                        color="#D9D9D9"
                                    />
                                </CustomGrid>
                                <CustomGrid item container xs={1} justifyContent="center">
                                    <CustomTypography
                                        sx={{ fontSize: '12px' }}
                                        nameSpace="profile"
                                        translation="seatsTeamMembers.subscription"
                                        color="#D9D9D9"
                                    />
                                </CustomGrid>

                                <CustomGrid item container xs={2} justifyContent="center">
                                    <CustomTypography
                                        sx={{ fontSize: '12px' }}
                                        nameSpace="profile"
                                        translation="seatsTeamMembers.business"
                                        color='#D9D9D9'
                                    />
                                </CustomGrid>
                            </CustomGrid>
                        )
                    }
                    {profileTeamMembers.length > 0 && profileTeamMembers.map((tm, tindex) => (
                        <CustomGrid container item spacing={2} key={tindex} alignItems="center">
                            <CustomGrid item xs={3} className={styles.activeEmailWrapper}>
                                <CustomTypography
                                    sx={{ fontSize: '12px' }}
                                    color='#D9D9D9'
                                >{tm.email}</CustomTypography>
                            </CustomGrid>
                            <CustomGrid item xs={2} container justifyContent="center">
                                <CustomTypography
                                    sx={{ fontSize: '12px' }}

                                    color='#D9D9D9'
                                >
                                    {tm.role}
                                </CustomTypography>
                            </CustomGrid>
                            {
                                tm.status === 'pending'
                                    ? (
                                        <>
                                            <CustomGrid item xs={2} container justifyContent="center">
                                                <CustomTypography
                                                    sx={{ fontSize: '12px' }}
                                                    color='#D9D9D9'
                                                >
                                                    pending
                                                </CustomTypography>
                                            </CustomGrid>
                                            <CustomGrid item container xs={1} justifyContent="center">
                                                {
                                                    tm.seat === 'free'
                                                        ? (
                                                            <CustomTypography
                                                                sx={{ fontSize: '12px' }}
                                                                nameSpace="profile"
                                                                translation="seatsTeamMembers.free"
                                                                color='#D9D9D9'
                                                            />
                                                        )
                                                        : (
                                                            <CustomTypography
                                                                sx={{ fontSize: '12px' }}
                                                                nameSpace="profile"
                                                                translation="seatsTeamMembers.subscription"
                                                                color='#D9D9D9'
                                                            />
                                                        )
                                                }
                                            </CustomGrid>
                                            <CustomGrid item container xs={2} justifyContent="center">
                                                <CustomTypography
                                                    sx={{ fontSize: '12px' }}
                                                    nameSpace="profile"
                                                    translation="seatsTeamMembers.business"
                                                    color='#D9D9D9'
                                                />
                                            </CustomGrid>
                                            <CustomGrid item xs={2} container justifyContent="center">
                                                <ActionButton
                                                    variant="black"
                                                    onAction={() => handleRemovePendingMember(tm.email)}
                                                    className={styles.deviceButton}
                                                    Icon={<FontAwesomeIcon icon={faTrashCan} />}
                                                />
                                            </CustomGrid>
                                        </>
                                    )
                                    : (
                                        <>
                                            {
                                                !profile.teamOrganization?.name && (
                                                    <>
                                                        <CustomGrid item container xs={2} justifyContent="center">
                                                            <CustomTypography
                                                                sx={{ fontSize: '12px' }}
                                                                nameSpace="profile"
                                                                translation="seatsTeamMembers.active"
                                                                color="#D9D9D9"
                                                            />
                                                        </CustomGrid>
                                                        {tm.seat === 'free' ? (
                                                            <CustomGrid item container xs={1} justifyContent="center">
                                                                <CustomTypography
                                                                    sx={{ fontSize: '12px' }}
                                                                    nameSpace="profile"
                                                                    translation="seatsTeamMembers.free"
                                                                    color="#D9D9D9"
                                                                />
                                                            </CustomGrid>
                                                        ) : (
                                                            <CustomGrid item container xs={1} justifyContent="center">
                                                                <CustomTypography
                                                                    sx={{ fontSize: '12px' }}
                                                                    nameSpace="profile"
                                                                    translation="seatsTeamMembers.subscription"
                                                                    color="#D9D9D9"
                                                                />
                                                            </CustomGrid>
                                                        )}
                                                    </>
                                                )
                                            }

                                            <CustomGrid item container xs={2} justifyContent="center">
                                                <CustomTypography
                                                    sx={{ fontSize: '12px' }}
                                                    nameSpace="profile"
                                                    translation="seatsTeamMembers.business"
                                                    color='#D9D9D9'
                                                />
                                            </CustomGrid>
                                            {
                                                !(!profile.teamOrganization?.name || tm.role === 'admin') && (
                                                    <CustomGrid item container xs={2} justifyContent="center">
                                                        <CustomPaper
                                                            variant="black-glass"
                                                            className={styles.deviceButton}
                                                        >
                                                            <ActionButton
                                                                variant="black"
                                                                onAction={() => handleRemoveMemberFromProfile(tm.email)}
                                                                className={styles.deviceButton}
                                                                Icon={<FontAwesomeIcon icon={faTrashCan} />}
                                                            />
                                                        </CustomPaper>
                                                    </CustomGrid>
                                                )
                                            }
                                        </>
                                    )
                            }
                        </CustomGrid>
                    ))
                    }
                    {
                        teamMembers.map((member, index) => (
                            <CustomGrid container item spacing={2} key={index} alignItems="center">
                                <CustomGrid item xs={3}>
                                    <InputBase
                                        label="Email"
                                        value={member.email}
                                        placeholder="email"
                                        onChange={(e) => handleEmailChange(index, e.target.value)}
                                        className={styles.emailInputBase}
                                    />
                                </CustomGrid>
                                <CustomGrid item xs={2} container justifyContent="center">
                                    <CustomTypography
                                        sx={{ fontSize: '12px' }}
                                        nameSpace="profile"
                                        translation="seatsTeamMembers.teamMember"
                                        color='#D9D9D9'
                                    />
                                </CustomGrid>
                                <CustomGrid item container xs={2} justifyContent="center">
                                    {member.valid && (
                                        <Button
                                            variant="text"
                                            className={styles.sendInvitationBtn}
                                            onClick={() => handleSendInvitation(index)}
                                        >
                                            send invite
                                        </Button>
                                    )}
                                </CustomGrid>
                                <CustomGrid item container xs={1} justifyContent="center">
                                    <CustomTypography
                                        sx={{ fontSize: '12px' }}
                                        nameSpace="profile"
                                        translation="seatsTeamMembers.free"
                                        color='#D9D9D9'
                                    />
                                </CustomGrid>
                                <CustomGrid item container xs={2} justifyContent="center">
                                    <CustomTypography
                                        sx={{ fontSize: '12px' }}
                                        nameSpace="profile"
                                        translation="seatsTeamMembers.business"
                                        color='#D9D9D9'
                                    />
                                </CustomGrid>
                                <CustomGrid item container xs={2} justifyContent="center">
                                    <CustomPaper
                                        variant="black-glass"
                                        className={styles.deviceButton}
                                    >
                                        <ActionButton
                                            variant="black"
                                            onAction={() => handleRemoveMember(index)}
                                            className={styles.deviceButton}
                                            Icon={<FontAwesomeIcon icon={faTrashCan} />}
                                        />
                                    </CustomPaper>
                                </CustomGrid>
                            </CustomGrid>
                        ))
                    }
                </ConditionalRender>
            </CustomGrid >
        </CustomPaper >
    );
};

export const SeatsTeamMembers = memo(Component);
