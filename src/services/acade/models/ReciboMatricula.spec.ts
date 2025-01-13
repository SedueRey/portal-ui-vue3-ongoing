import { describe, expect, it } from 'vitest';
import ReciboMatricula from './ReciboMatricula';

describe('testing ReciboMatricula mock structure', () => {
  it('should have object structure', () => {
    const reciboMatriculaMock = ReciboMatricula();
    expect(reciboMatriculaMock).toHaveProperty([
      'idrecibo',
      'descripcion',
      'importe',
      'domiciliado',
      'numref',
      'estado',
      'acciones',
    ]);
  });
});
