import chance from '@/services/asyncDataGenerator';

const solicitarLinea = {
  plazo: null, // null si no esta abierto
  _links: {
    collection: {
      href: chance.url(), // null si no esta abierto
    },
  },
};

const lineasSeleccionadas = { // Ordenados por prioridad
  plazoAsignacionLinea: null,
  lineas: [
    {
      prioridad: chance.string({ length: 1, pool: '0123456789' }),
      titulo: chance.sentence(),
      descripcion: chance.sentence(),
      tutores: [
        {
          nombreApellidos: chance.sentence(),
        },
      ],
    },
    {
      prioridad: chance.string({ length: 1, pool: '0123456789' }),
      titulo: chance.sentence(),
      descripcion: chance.sentence(),
      tutores: [
        {
          nombreApellidos: chance.sentence(),
        },
        {
          nombreApellidos: chance.sentence(),
        },
      ],
    },
    {
      prioridad: chance.string({ length: 1, pool: '0123456789' }),
      titulo: chance.sentence(),
      descripcion: chance.sentence(),
      tutores: [
        {
          nombreApellidos: chance.sentence(),
        },
      ],
    },
  ],
};

const asignacionLinea = {
  plazoSubidaTrabajo: null, // null si no esta abierto
  linea:
    {
      prioridad: '1', // Prioridad de la línea seleccionada
      titulo: chance.sentence(), // Nombre de la línea seleccionada
      fecha: '26/07/2015',
      estado: 'Definitivo',
      puedeSolicitarFebrero: 'S',
      puedeDefenderFebrero: 'S',
      descripcion: chance.sentence(), // Descripción de la línea seleccionada
      tutores: [ // Tutor o tutores de la línea seleccionada
        {
          nombreApellidos: 'Jose antonio Sanchez',
        },
      ],
    },
  _links: {
    collection: {
      href: 'https://tf.um.es/...', // URL para la subida del trabajo en tf.um.es
    },
  },
};

const tribunal = {
  fechaSubidaTrabajo: '26/03/2002', // null si no se ha subido trabajo
  coordinadores: [
    {
      nombre: chance.sentence(),
      email: chance.sentence(),
    },
    {
      nombre: chance.sentence(),
      email: chance.sentence(),
    },
  ],
  convocatorias: [
    {
      convocatoria: chance.pickone(['Febrero', 'Junio', 'Julio']),
      nombreTribunal: chance.sentence(),
      edificio: chance.sentence(),
      aula: chance.pickone(['Aula 0.02', 'Aula B1.5.7']),
      fecha: '30/12/2004 15:00',
      duracion: '400', // minutos
      observaciones: chance.sentence(),
      resguardo: 'sddsdsds', // pdf, bytes
    },
    {
      convocatoria: chance.pickone(['Febrero', 'Junio', 'Julio']),
      nombreTribunal: chance.sentence(),
      edificio: chance.sentence(),
      aula: chance.pickone(['Aula 0.02', 'Aula B1.5.7']),
      fecha: '30/12/2004 15:00',
      duracion: '400', // minutos
      observaciones: chance.sentence(),
      resguardo: 'ddsdss', // pdf, bytes
    },
  ],
};

const calificaciones = {
  evaluado: true, // o false si no se ha evaluado para el curso académico y convocatoria
  convocatorias: [
    {
      convocatoria: chance.pickone(['Febrero', 'Junio', 'Julio']),
      calificacion: '8.0 Notable',
      documentoCalificacionesCondicionadas: true,
    },
    {
      convocatoria: chance.pickone(['Febrero', 'Junio', 'Julio']),
      calificacion: '5.0 Aprobado',
      documentoCalificacionesCondicionadas: false,
    },
    {
      convocatoria: chance.pickone(['Febrero', 'Junio', 'Julio']),
      calificacion: '8.0 Sobresaliente (Matricula de Honor)',
      documentoCalificacionesCondicionadas: false,
    },
  ],
};

export default () => ({
  solicitarLinea,
  lineasSeleccionadas,
  asignacionLinea,
  tribunal,
  calificaciones,
});
