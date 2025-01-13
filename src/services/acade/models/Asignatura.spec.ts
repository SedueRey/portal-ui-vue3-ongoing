import { describe, expect, it } from 'vitest';
import Asignatura from './Asignatura';

describe('testing Asignatura mock structure', () => {
  it('should have object structure', () => {
    const asignatura = Asignatura();
    expect(asignatura).toHaveProperty([
      'ciclo',
      'curso',
      'codigo',
      'nombre',
      'tipo',
      'creditos',
      'duracion',
      'periodo',
      'cursoAcademico',
      'especialidad',
      'estado',
      'convocatorias',
      'grupoLeccionMagistral',
      'grupoSeminario',
      'grupoPracticas',
      'grupoTutorias',
    ]);
  });
});
