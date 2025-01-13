import chance from '@/services/asyncDataGenerator';

export default () => ({
  estado: chance.pickone(['en trámite', 'denegada', 'otro', 'enum']),
  estadoDescripcion: chance.sentence(),
  creditosMatriculados: chance.floating({ min: 0, max: 60, fixed: 1 }), // float
  creditosNecesarios: chance.floating({ min: 0, max: 40, fixed: 1 }), // float
  creditosSuspensos: chance.floating({ min: 0, max: 60, fixed: 1 }), // float
  maximoCreditosSuspensos: chance.floating({ min: 0, max: 40, fixed: 1 }), // float
  notaMedia: chance.floating({ min: 1, max: 10, fixed: 2 }), // de los datos de la beca, supongo
  // Si el array es vacío, cumple requisitos.
  requisitosFallidosBeca: chance.pickone(
    [
      [],
      [{
        motivo: 'No tiene los créditos suficientes',
      }],
    ],
  ),
});
