import { Injectable } from '@nestjs/common';
import { RulesConfig } from '../../config/rules.config';
import { PlayerRepository } from '../../repository/player/player.repository';

@Injectable()
export class PlayerService {
  constructor(
    private readonly rulesConfig: RulesConfig,
    private readonly playerRepository: PlayerRepository,
  ) {}

  async canPlayerRegister(player: string): Promise<boolean> {
    if (this.rulesConfig.canPlayersMultiTournament()) {
      return true;
    }

    const isPlayerAlreadyRegistered =
      await this.playerRepository.isPlayerAlreadyRegistered(player);

    return !isPlayerAlreadyRegistered;
  }
}
