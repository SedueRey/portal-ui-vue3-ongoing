import { describe, expect, it } from 'vitest';
import Grupo from './Grupo';

describe('testing Grupo mock structure', () => {
  it('should have object structure', () => {
    const groupMock = Grupo();
    expect(groupMock).toBeTruthy();
    expect(groupMock).toHaveProperty([
      'uuid',
      'denominacion',
      'descripcion',
      'turno',
      'modalidad',
      'horariosGrupo',
    ]);
  });
});
