import { describe, expect, it } from 'vitest';
import { randomIntFromInterval } from './utils';

describe('testing random number generator between two numbers', () => {
  it('should have object structure', async () => {
    expect(randomIntFromInterval(0, 15)).toBeGreaterThanOrEqual(0);
    expect(randomIntFromInterval(0, 15)).toBeLessThanOrEqual(15);
    expect(randomIntFromInterval(3, 10)).toBeGreaterThanOrEqual(3);
    expect(randomIntFromInterval(3, 10)).toBeLessThanOrEqual(10);
  });
});
