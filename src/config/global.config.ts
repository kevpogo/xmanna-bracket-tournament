import * as env from 'env-var';
import { Injectable } from '@nestjs/common';

@Injectable()
export class GlobalConfig {
  port(): number {
    return env.get('PORT').default('3000').asInt();
  }
}

export const globalConfig = new GlobalConfig();
