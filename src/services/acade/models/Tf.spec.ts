import { describe, expect, it } from 'vitest';
import miTF from './TF';

describe('testing TF mock structure', () => {
  it('should have object structure', async () => {
    const MiTF = await miTF();
    expect(MiTF).toHaveProperty([
      'solicitarLinea',
      'lineasSeleccionadas',
      'asignacionLinea',
      'tribunal',
      'calificaciones',
    ]);
  });
});
