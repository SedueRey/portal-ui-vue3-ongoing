import { describe, expect, it } from 'vitest';
import ConvocatoriaGrupo from './ConvocatoriaGrupo';

describe('testing ConvocatoriaGrupo mock structure', () => {
  it('should have object structure', () => {
    const convocatoriaGrupoMock = ConvocatoriaGrupo();
    expect(convocatoriaGrupoMock.length).not.toBeFalsy();
    expect(convocatoriaGrupoMock.length).toBeGreaterThan(0);
    expect(convocatoriaGrupoMock).toBeTruthy();
    const firstConvocatoriaGrupo = convocatoriaGrupoMock[0];
    expect(firstConvocatoriaGrupo).toBeTruthy();
    expect(firstConvocatoriaGrupo).toHaveProperty('bloques');
    expect(firstConvocatoriaGrupo.bloques.length).not.toBeFalsy();
    expect(firstConvocatoriaGrupo.bloques.length).toBeGreaterThan(0);
    expect(firstConvocatoriaGrupo.bloques[0]).toBeTruthy();
  });
});
