import { describe, expect, it } from 'vitest';
import Curso from './Curso';

describe('testing Curso mock structure', () => {
  it('should have object structure', () => {
    const courseMock = Curso();
    expect(courseMock).toBeTruthy();
    expect(courseMock).toHaveProperty([
      'curso',
      'cursoNombre',
      'cursoAcademico',
      'matriculados',
      'aprobados:',
      'pendientes:',
    ]);
  });
});
