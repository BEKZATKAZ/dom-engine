export class Random {
  public static uniform(inclusive: number, exclusive: number) {
    return Math.random() * (exclusive - inclusive) + inclusive;
  }
};
