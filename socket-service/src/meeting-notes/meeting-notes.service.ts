import { Injectable } from '@nestjs/common';
import {InjectModel} from "@nestjs/mongoose";
import {Model} from "mongoose";

import {MeetingNote, MeetingNoteDocument} from "../schemas/meeting-note.schema";
import {ITransactionSession} from "../helpers/mongo/withTransaction";

@Injectable()
export class MeetingNotesService {
    constructor(
        @InjectModel(MeetingNote.name) private meetingNote: Model<MeetingNoteDocument>,
    ) {}

    async create(data, { session }: ITransactionSession) {
        return this.meetingNote.create([data], { session });
    }
}
