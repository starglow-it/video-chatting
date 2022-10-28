import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';

@Schema()
export class CountryStatistic {
    @Prop({
        type: mongoose.Schema.Types.String,
        required: true,
    })
    key: string;

    @Prop({
        type: mongoose.Schema.Types.String,
        required: true,
    })
    value: string;

    @Prop({
        type: mongoose.Schema.Types.String,
        required: true,
    })
    color: string;
}

export type CountryStatisticDocument = CountryStatistic & Document;

export const CountryStatisticSchema =
    SchemaFactory.createForClass(CountryStatistic);
