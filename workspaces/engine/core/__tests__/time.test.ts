import { Time } from "time";

it("calculates deltaTime based on last and current time", () => {
  Time.updateTimeSinceStart(0.1);
  assert.strictEqual(Time.deltaTime, 0.1);
  assert.strictEqual(Time.timeSinceStart, 0.1);
  
  Time.updateTimeSinceStart(0.5);
  assert.strictEqual(Time.deltaTime, 0.4);
  assert.strictEqual(Time.timeSinceStart, 0.5);
});
