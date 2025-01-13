import Asignatura from './models/Asignatura';
import Beca from './models/Beca';
import chance from '@/services/asyncDataGenerator';
import Curso from './models/Curso';
import Matricula from './models/Matricula';
import PagoMatricula from './models/PagoMatricula';
import { randomIntFromInterval } from '../utils';
import ReciboMatricula from './models/ReciboMatricula';

export function MatriculaService() {
  const autoMatricula = {
    _links: {
      opener: {
        href: 'https://automatricula.um.es/automatricula/paginas/SeleccionTitulo.seam',
      },
    },
  };

  const numMatriculas = randomIntFromInterval(1, 8);
  const matriculas = [];
  for (let i = 1; i <= numMatriculas; i += 1) {
    matriculas.push(Matricula() as never);
  }

  return Promise.resolve({
    matriculas,
    autoMatricula: chance.pickone([autoMatricula, null]),
  });
}

export function AsignaturasService() {
  const numAsignaturas = randomIntFromInterval(1, 14);
  const respuesta = [];
  for (let i = 1; i <= numAsignaturas; i += 1) {
    respuesta.push(Asignatura() as never);
  }
  return Promise.resolve(respuesta);
}

export function BecaService() {
  return Promise.resolve(Beca());
}

export function PagoMatriculaService() {
  return Promise.resolve(PagoMatricula());
}

export function RecibosMatriculaService() {
  const numRecibos = randomIntFromInterval(1, 4);
  const respuesta = [];
  for (let i = 1; i <= numRecibos; i += 1) {
    respuesta.push(ReciboMatricula() as never);
  }
  return Promise.resolve(respuesta);
}

export function CursoAcademicoService() {
  return Promise.resolve(Curso());
}
