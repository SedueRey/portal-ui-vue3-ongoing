import chance from '@/services/asyncDataGenerator';
import { randomIntFromInterval } from '../../utils';

const random = randomIntFromInterval(1, 3);

const horarios = [];

const getThisMonday = (date = new Date()) => {
  const dateCopy = new Date(date.getTime());
  const thisMonday = new Date(
    dateCopy.setDate(
      dateCopy.getDate() + ((7 - dateCopy.getDay() + 1) % 7 || 7),
    ),
  );
  thisMonday.setDate(thisMonday.getDate() - 7);
  return thisMonday;
};

for (let index = 0; index < random; index += 1) {
  const daysOfWeek = 5;
  for (let k = 0; k < daysOfWeek; k += 1) {
    const fecha = getThisMonday();
    const finfecha = getThisMonday();
    fecha.setDate(fecha.getDate() + k);
    const hora = randomIntFromInterval(8, 20);
    fecha.setHours(hora, 0);
    finfecha.setDate(fecha.getDate());
    finfecha.setHours(fecha.getHours(), 55);
    const fechaInicio = fecha.toISOString();
    if (
      !horarios.find((el) => el.fechaInicio === fechaInicio)
    ) {
      horarios.push({
        fechaInicio,
        fechaFin: finfecha.toISOString(),
        ubicacion: chance.pickone([chance.word({ syllables: 3 }), '']),
      });
    }
  }
}

export default () => ({
  codigoAsignatura: chance.string({ pool: '0123456789', length: 4 }),
  nombreAsignatura: chance.word({ syllables: 5 }),
  horarios,
});
