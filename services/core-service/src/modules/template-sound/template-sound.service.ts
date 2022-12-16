import { Injectable } from '@nestjs/common';
import {InjectModel} from "@nestjs/mongoose";
import {Model} from "mongoose";

import {ITransactionSession} from "../../helpers/mongo/withTransaction";
import {TemplateSoundFile, TemplateSoundFileDocument} from "../../schemas/template-sound-file.schema";

@Injectable()
export class TemplateSoundService {
    constructor(
        @InjectModel(TemplateSoundFile.name)
        private templateSound: Model<TemplateSoundFileDocument>,
    ) {}

    async create({ data, session }: { data: any; session: ITransactionSession }) {
        return this.templateSound.create([data], { session: session?.session });
    }
}
