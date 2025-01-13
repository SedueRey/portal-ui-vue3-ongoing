import { describe, expect, it } from 'vitest';
import PagoMatricula from './PagoMatricula';

describe('testing PagoMatricula mock structure', () => {
  it('should have object structure', () => {
    const userPagoMatricula = PagoMatricula();
    expect(userPagoMatricula).toHaveProperty([
      'domiciliaPago',
      'fraccionaPago',
      'solicitaBeca',
      'cuentaDomicilioPago',
      'seguroEscolar',
      'plazos',
      'pagos',
    ]);
  });
});
