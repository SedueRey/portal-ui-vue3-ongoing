import chance from '@/services/asyncDataGenerator';

const matriculados = chance.integer({ min: 6, max: 60 });
const aprobados = chance.integer({ min: 6, max: 20 });

export default () => ({
  curso: chance.integer({ min: 1, max: 4 }),
  cursoNombre: chance.pickone(['Primero', 'Segundo', 'Tercero', 'Cuarto']),
  cursoAcademico: new Date().getFullYear(),
  matriculados,
  aprobados: (aprobados > matriculados ? matriculados : aprobados),
  pendientes: aprobados > matriculados ? 0 : matriculados - aprobados,
});
