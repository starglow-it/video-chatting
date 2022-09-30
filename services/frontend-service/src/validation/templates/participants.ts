import { simpleNumberSchema } from '../common';
import { MAX_PARTICIPANTS_NUMBER } from '../../const/templates/info';

export const participantsNumberSchema = () =>
    simpleNumberSchema().min(1).max(MAX_PARTICIPANTS_NUMBER);
