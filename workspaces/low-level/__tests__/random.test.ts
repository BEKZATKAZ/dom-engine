import { Random } from "math";

it("does not go beyond inclusive/exclusive", () => {
  for (let i = 0; i < 1000; i++) {
    const result = Random.uniform(100, 200);
    expect(result).toBeGreaterThanOrEqual(100);
    expect(result).toBeLessThan(200);
  }
});
