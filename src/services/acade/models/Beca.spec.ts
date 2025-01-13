import { describe, expect, it } from 'vitest';
import Beca from './Beca';

describe('testing Beca mock structure', () => {
  it('should have object structure', async () => {
    const userBeca = await Beca();
    expect(userBeca).toHaveProperty([
      'estado',
      'estadoDescripcion',
      'creditosMatriculados',
      'creditosNecesarios',
      'creditosSuspensos',
      'maximoCreditosSuspensos',
      'requisitosFallidosBeca',
    ]);
    expect(typeof userBeca.creditosMatriculados).toBe('number');
    expect(userBeca.creditosMatriculados).toBeLessThanOrEqual(60.0);
    expect(userBeca.creditosMatriculados).not.toBeNaN();
  });
});
