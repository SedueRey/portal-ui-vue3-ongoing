import chance from '@/services/asyncDataGenerator';
import { randomIntFromInterval } from '../../utils';

const convocatoriaIncidencias = {
  _links: {
    opener: {
      href: '/#/convocatoriaincidencias/inicio',
    },
  },
};

chance.mixin({
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  convocatoria(): any {
    return {
      convocatoria: chance.pickone(['febrero', 'junio', 'julio', null]),
      nota: chance.pickone([chance.floating({ min: 0, max: 10, fixed: 2 }), null]),
      notaNumerica: chance.bool(),
      notaDescripcion: chance.pickone([
        'Aprobado',
        'Matrícula de honor',
        'No presentado',
        'Notable',
        'Sobresaliente',
        'Suspenso',
      ]),
      convocatoriaIncidencias: chance.weighted([convocatoriaIncidencias, null], [20, 80]),
    };
  },
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function convocatorias(): any[] {
  const numConvocatorias = randomIntFromInterval(1, 6);
  const respuesta = [];
  for (let index = 1; index <= numConvocatorias; index += 1) {
    const c = chance.convocatoria();
    respuesta.push(c as never);
  }
  return respuesta;
}

export default () => ({
  ciclo: chance.word(),
  curso: chance.pickone(['primero', 'segundo', 'tercero', 'cuarto', null]),
  codigo: chance.string({ length: 4, pool: '0123456789' }),
  nombre: chance.sentence(),
  tipo: chance.pickone(['troncal', 'obligatoria', 'optativa', null]),
  creditos: chance.floating({ min: 0.1, max: 12, fixed: 1 }),
  duracion: chance.pickone(['cuatrimestral', 'anual', 'semestral', null]),
  periodo: chance.pickone([chance.string({ length: 1, pool: '1234' }), null]),
  cursoAcademico: new Date().getFullYear(),
  especialidad: chance.pickone([chance.sentence({ words: 5 }), null]),
  estado: {
    superada: chance.bool(),
    estadoDescripcion: chance.pickone(['superada', 'reconocida', 'aprobada', 'no presentada']),
    estadoDescripcionLarga: chance.pickone([chance.sentence({ words: 20 }), null]),
    cursoAcademicoSuperada: new Date().getFullYear(),
    convocatoriaSuperada: chance.pickone([new Date().getFullYear(), null]),
  },
  convocatorias: convocatorias(),
  grupoLeccionMagistral: `Grupo ${chance.integer({ min: 1, max: 5 })}`,
  grupoSeminario: `Grupo 1.${chance.integer({ min: 1, max: 5 })}. [${chance.integer({ min: 1, max: 5 })}]`,
  grupoPracticas: `Grupo 1.${chance.integer({ min: 1, max: 5 })}. [${chance.integer({ min: 1, max: 5 })}]`,
  grupoTutorias: `Grupo ${chance.integer({ min: 1, max: 5 })}`,
});
