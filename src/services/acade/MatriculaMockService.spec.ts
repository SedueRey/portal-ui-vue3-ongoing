import {
  AsignaturasService,
  BecaService,
  MatriculaService,
  PagoMatriculaService,
  RecibosMatriculaService,
} from './MatriculaMockService';
import { describe, expect, it } from 'vitest';

describe('· testing services on MatriculaMockService', () => {
  it('should return groups in MatriculaService', async () => {
    const mock = await MatriculaService();
    expect(mock.matriculas.length).not.toBeFalsy();
    expect(mock.matriculas.length).toBeGreaterThan(0);
    expect(mock).toBeTruthy();
  });
  it('should return groups in AsignaturasService', async () => {
    const mock = await AsignaturasService();
    expect(mock.length).not.toBeFalsy();
    expect(mock.length).toBeGreaterThan(0);
    expect(mock).toBeTruthy();
  });
  it('should return groups in BecaService', async () => {
    const mock = await BecaService();
    expect(mock).toBeTruthy();
  });
  it('should return groups in PagoMatriculaService', async () => {
    const mock = await PagoMatriculaService();
    expect(mock).toBeTruthy();
  });
  it('should return groups in RecibosMatriculaService', async () => {
    const mock = await RecibosMatriculaService();
    expect(mock).toBeTruthy();
  });
});
