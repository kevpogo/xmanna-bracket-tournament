interface PlayerConstructorParams {
  name: string;
  score?: number;
}

export class Player {
  name: string;
  score?: number;

  constructor({ name, score }: PlayerConstructorParams) {
    this.name = name;
    this.score = score;
  }
}
