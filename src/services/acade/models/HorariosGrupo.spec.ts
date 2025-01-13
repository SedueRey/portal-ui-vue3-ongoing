import { describe, expect, it } from 'vitest';
import HorariosGrupo from './HorariosGrupo';

describe('testing HorariosGrupo mock structure', () => {
  it('should have object structure', () => {
    const groupMock = HorariosGrupo();
    expect(groupMock).toBeTruthy();
    expect(groupMock).toHaveProperty(['codigoAsignatura', 'nombreAsignatura', 'horarios']);
    expect(typeof groupMock.horarios).toBeTruthy();
  });
});
