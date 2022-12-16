
import { Expose, Transform } from 'class-transformer';

import { ITemplateSoundFile } from 'shared-types';

export class TemplateSoundFileDTO implements ITemplateSoundFile {
    @Expose()
    @Transform((data) => data.obj['_id'])
    id: string;

    @Expose()
    url: ITemplateSoundFile["url"];

    @Expose()
    mimeType: ITemplateSoundFile["mimeType"];

    @Expose()
    size: ITemplateSoundFile["size"];

    @Expose()
    fileName: ITemplateSoundFile["fileName"];
}
