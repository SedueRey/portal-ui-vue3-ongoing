import chance from '@/services/asyncDataGenerator';

const asignaturasMatriculadas = {
  _links: {
    collection: {
      href: chance.url(),
    },
  },
};

const bajaMatricula = {
  _links: {
    opener: {
      href: '/#/bajamatricula',
    },
  },
};

const datosBeca = {
  _links: {
    item: {
      href: chance.url(),
    },
  },
};

const datosPago = {
  _links: {
    item: {
      href: chance.url(),
    },
  },
};

const cambioGrupo = {
  _links: {
    opener: {
      href: '/#/feature-flag/cambio-grupo',
    },
  },
};

const recibos = {
  _links: {
    item: {
      href: chance.url(),
    },
  },
};

const mantenimientoPreciosPublicos = {
  _links: {
    opener: {
      href: '/#/mantenimientopreciospublicos',
    },
  },
};

export default () => ({
  cursoAcademico: chance.year({ min: 2000, max: 2022 }),
  titulacion: chance.string({ length: 3, pool: '0123456789' }),
  titulacionDescripcion: chance.sentence(),
  tipo: chance.pickone(['grado', 'master', 'posgrado', 'doctorado', chance.falsy()]),
  plan: '01',
  planDescripcion: 'Plan 2017',
  tipoEnsenanza: 'Oficial',
  tipoMatricula: 'A tiempo completo',
  estado: chance.pickone(['en proceso de pago', 'anulada', 'matriculada']),
  practicasConMenores: chance.bool(),
  asignaturasMatriculadas,
  datosBeca,
  datosPago,
  recibos,
  mantenimientoPreciosPublicos: chance.pickone([mantenimientoPreciosPublicos]),
  bajaMatricula: chance.pickone([bajaMatricula]),
  cambioGrupo: chance.pickone([cambioGrupo]),
});
