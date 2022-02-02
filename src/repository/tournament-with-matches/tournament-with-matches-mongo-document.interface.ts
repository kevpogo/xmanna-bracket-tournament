import { TournamentMongoDocumentInterface } from '../tournament/tournament-mongo-document.interface';
import { MatchMongoDocumentInterface } from '../match/match-mongo-document.interface';

export interface TournamentWithMatchesMongoDocumentInterface
  extends TournamentMongoDocumentInterface {
  matches: MatchMongoDocumentInterface[];
}
