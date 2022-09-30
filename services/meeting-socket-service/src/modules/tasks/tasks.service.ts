import { Injectable, Logger } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';

@Injectable()
export class TasksService {
  private readonly logger = new Logger(TasksService.name);
  constructor(private schedulerRegistry: SchedulerRegistry) {}

  addTimeout({
    name,
    ts,
    callback,
  }: {
    name: string;
    ts: number;
    callback: () => void;
  }) {
    const isExists = this.schedulerRegistry.doesExist('timeout', name);

    if (isExists) return;

    const timeout = setTimeout(() => {
      this.logger.log(`Timeout with name [${name}] is going to fire`);
      callback();
    }, ts);

    this.schedulerRegistry.addTimeout(name, timeout);
    this.logger.log(`Timeout with name [${name}] will fire after ${ts}ms`);
  }

  deleteTimeout({ name }: { name: string }) {
    const timeout = this.schedulerRegistry.doesExist('timeout', name);

    if (!timeout) return;

    this.schedulerRegistry.deleteTimeout(name);
    this.logger.log(`Timeout with name [${name}] deleted`);
  }

  isTimeoutExists({ name }) {
    return this.schedulerRegistry.doesExist('timeout', name);
  }
}
