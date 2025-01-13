import chance from '@/services/asyncDataGenerator';

const crypto = window.crypto || null;

export default () => ({
  uuid: crypto ? crypto.randomUUID() : '',
  denominacion: `${chance.string({ length: 5 })} ${chance.integer({ min: 1, max: 20 })}`,
  descripcion: chance.pickone([chance.sentence({ words: 5 }), null]),
  turno: chance.pickone(['mañana', 'tarde', 'mixto', null]),
  modalidad: chance.pickone(['presencial', 'online']),
  horariosGrupo: {
    _links: {
      collection: {
        href: chance.url(),
      },
    },
  },
});
