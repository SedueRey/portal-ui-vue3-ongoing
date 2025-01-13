import { describe, expect, it } from 'vitest';
import Widget from './Widget';

describe('testing Widget mock structure', () => {
  it('should have object structure', async () => {
    const widgetMock = await Widget();
    expect(widgetMock).toHaveProperty('name');
    expect(widgetMock).toHaveProperty('position');
  });
});
