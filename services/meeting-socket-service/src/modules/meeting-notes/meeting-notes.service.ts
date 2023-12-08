import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import {
  MeetingNote,
  MeetingNoteDocument,
} from '../../schemas/meeting-note.schema';
import { ITransactionSession } from '../../helpers/mongo/withTransaction';
import { GetModelMultipleQuery } from 'src/types/mongoose';

@Injectable()
export class MeetingNotesService {
  constructor(
    @InjectModel(MeetingNote.name)
    private meetingNote: Model<MeetingNoteDocument>,
  ) {}

  async create(data, { session }: ITransactionSession) {
    return this.meetingNote.create([data], { session });
  }

  async deleteOne(query, { session }: ITransactionSession): Promise<void> {
    await this.meetingNote.deleteOne(query, { session });

    return;
  }

  async findMany({
    query,
    populatePaths,
    session = null,
  }: GetModelMultipleQuery<MeetingNoteDocument>) {
    return this.meetingNote
      .find(query, {}, { session: session?.session, populate: populatePaths })
      .exec();
  }
}
