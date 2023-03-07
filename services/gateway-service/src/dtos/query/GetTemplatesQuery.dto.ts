import {IsBoolean, IsNumber, IsOptional, IsString} from "class-validator";
import {toNumber} from "../../utils/parsers/toNumber";
import {Transform} from "class-transformer";
import {toBoolean} from "../../utils/parsers/toBoolean";

export class GetTemplatesQueryDto {
    @Transform(({ value }) => toNumber(value, 0))
    @IsOptional()
    @IsNumber()
    public skip;

    @Transform(({ value }) => toNumber(value, 0))
    @IsOptional()
    @IsNumber()
    public limit;

    @IsOptional()
    public userId;

    @Transform(({ value }) => toBoolean(value))
    @IsOptional()
    @IsBoolean()
    public draft;

    @Transform(({ value }) => toBoolean(value))
    @IsOptional()
    @IsBoolean()
    public isPublic;

    @IsOptional()
    @IsString()
    public type;

    @IsOptional()
    @IsString()
    public sort;

    @Transform(({ value }) => toNumber(value, 1))
    @IsOptional()
    @IsNumber()
    public direction;
}