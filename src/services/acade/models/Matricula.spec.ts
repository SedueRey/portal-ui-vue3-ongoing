import { describe, expect, it } from 'vitest';
import Matricula from './Matricula';

describe('testing Matricula mock structure', () => {
  it('should have object structure', async () => {
    const matricula = await Matricula();
    expect(matricula).toHaveProperty([
      'cursoAcademico',
      'titulacion',
      'titulacionDescripcion',
      'plan',
      'planDescripcion',
      'tipoEnsenanza',
      'tipoMatricula',
      'estado',
      'practicasConMenores',
      'asignaturasMatriculadas',
      'datosBeca',
      'datosPago',
    ]);
  });
});
