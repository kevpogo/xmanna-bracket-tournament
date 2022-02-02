export abstract class ValueObject<T, Type> {
  private _type?: Type;

  constructor(public readonly value: T) {}
}
