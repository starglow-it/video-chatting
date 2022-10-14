import * as yup from 'yup';

import { simpleNumberSchema } from '../common';
import { MAX_PARTICIPANTS_NUMBER } from '../../const/templates/info';

export const participantsNumberSchema = () =>
    simpleNumberSchema().min(1).max(MAX_PARTICIPANTS_NUMBER);

export const participantsPositionsSchema = () =>
    yup.array().of(
        yup.object({
            left: yup.number(),
            top: yup.number(),
        }),
    );
