import * as env from 'env-var';
import { Injectable } from '@nestjs/common';

@Injectable()
export class RulesConfig {
  canPlayersMultiTournament(): boolean {
    return env
      .get('RULE_CAN_PLAYERS_MULTI_TOURNAMENT')
      .default('false')
      .asBool();
  }
}
