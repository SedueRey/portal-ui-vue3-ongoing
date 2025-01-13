import chance from '@/services/asyncDataGenerator';

const crypto = window.crypto || null;

const bloques = [];

for (let bloque = 0; bloque < chance.integer({ min: 2, max: 5 }); bloque += 1) {
  const asignaturas = [];

  for (let index = 0; index < chance.integer({ min: 2, max: 6 }); index += 1) {
    asignaturas.push({
      codigo: chance.string({ length: 4, pool: '0123456789' }),
      nombre: chance.sentence({ words: chance.integer({ min: 1, max: 6 }) }),
      tipo: chance.pickone(['G', 'P']),
      links: [],
    });
  }

  const subgrupos = [];

  for (let index = 0; index < chance.integer({ min: 2, max: 5 }); index += 1) {
    subgrupos.push({
      id: crypto ? crypto.randomUUID() : '',
      codigoGrupo: chance.integer({ min: 0, max: 9999 }),
      codigoSubgrupo: chance.integer({ min: 1, max: 99999 }),
      descripcion: chance.sentence({ words: chance.integer({ min: 1, max: 6 }) }),
      codigoTurno: chance.integer({ min: 0, max: 9999 }),
      descripcionTurno: chance.pickone(['mañana', 'tarde', 'lorem ipsum']),
      actividad: chance.sentence({ words: chance.integer({ min: 1, max: 6 }) }),
      prioridad: index,
      activo: chance.pickone([true, false]),
      links: [],
    });
  }

  bloques.push({
    id: chance.integer({ min: 0, max: 9999 }),
    descripcion: chance.sentence({ words: chance.integer({ min: 1, max: 6 }) }),
    asignaturas,
    subgrupos,
  });
}

export default () => ([{
  id: crypto ? crypto.randomUUID() : '',
  numeroConvocatoria: chance.integer({ min: 0 }),
  fechaInicio: '2023-06-06T08:24:51.000+00:00',
  fechaFin: '2023-09-29T08:24:58.000+00:00',
  bloques,
  links: [],
}]);
