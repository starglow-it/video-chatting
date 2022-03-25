import { Expose, Transform, Type } from 'class-transformer';

import { ProfileAvatarDTO } from './profile-avatar.dto';
import { IProfileAvatar } from '@shared/interfaces/profile-avatar.interface';
import {ITemplateUserDTO} from "@shared/interfaces/template-user.interface";

export class TemplateUserDTO implements ITemplateUserDTO {
    @Expose()
    @Transform((data) => data.obj['_id'])
    id: string;

    @Expose()
    @Type(() => ProfileAvatarDTO)
    profileAvatar: IProfileAvatar;
}
