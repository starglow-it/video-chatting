import { IsNotEmpty, IsArray } from 'class-validator';
import { IHandleAiTranscription } from 'src/interfaces/handle-ai-transcriptioin.interface';
export class handleAiTranscription implements IHandleAiTranscription {
  @IsNotEmpty()
  @IsArray()
  script: string[]
}
