import chance from '@/services/asyncDataGenerator';
import { randomIntFromInterval } from '../../utils';

chance.mixin({
  pago() {
    return {
      fechaCobro: new Date().toISOString(),
      importe: chance.floating({ fixed: 2, min: 0, max: 500 }),
    };
  },
});

function listaPagos() {
  const numPagos = randomIntFromInterval(1, 12);
  const respuesta = [];
  for (let index = 1; index <= numPagos; index += 1) {
    respuesta.push(chance.pago());
  }
  return respuesta;
}

export default () => ({
  domiciliaPago: chance.bool(),
  fraccionaPago: chance.bool(),
  solicitaBeca: chance.bool(),
  cuentaDomicilioPago: chance.pickone(
    [
      `${chance.country()}${chance.string({ pool: '0123456789', length: 22 })}`,
      null,
    ],
  ), // IBAN o null
  seguroEscolar: chance.floating({ fixed: 2, min: 0, max: 100 }),
  plazos: chance.integer({ min: 1, max: 12 }),
  pagos: listaPagos(),
});
