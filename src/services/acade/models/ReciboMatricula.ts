import chance from '@/services/asyncDataGenerator';

export default () => ({
  idrecibo: chance.integer({ min: 345010, max: 999999 }),
  descripcion: 'Plazo '.concat(chance.integer({ min: 1, max: 5 })),
  importe: chance.floating({ min: 1, max: 4000, fixed: 2 }),
  domiciliado: chance.bool(),
  numref: chance.string({ length: 13, numeric: true }),
  estado: chance.pickone(['EMITIDO', 'PAGADO', 'PAGADO', 'ENVIADO AL COBRO']),
  data: 'https://www.um.es/documents/877924/19282016/CO-EBAU2021-2+Doc.+9+Horarios+de+exa%CC%81menes.pdf/7f06c8b2-766b-5161-57f1-535e3f2f9a4d?t=1612871978511',
  acciones: [
    {
      accion: 'Generado',
      fecha: `${chance.integer({ min: 2015, max: 2023 })}-${chance.integer({ min: 1, max: 12 }).toString().padStart(2, '0')}-${chance.integer({ min: 1, max: 28 }).toString().padStart(2, '0')}T${chance.integer({ min: 0, max: 23 }).toString().padStart(2, '0')}:${chance.integer({ min: 0, max: 59 }).toString().padStart(2, '0')}:${chance.integer({ min: 0, max: 59 }).toString().padStart(2, '0')}.000+00:00`,
    },
    {
      accion: chance.pickone(['Emitido', 'Enviado al cobro']),
      fecha: `${chance.integer({ min: 2015, max: 2023 })}-${chance.integer({ min: 1, max: 12 }).toString().padStart(2, '0')}-${chance.integer({ min: 1, max: 28 }).toString().padStart(2, '0')}T${chance.integer({ min: 0, max: 23 }).toString().padStart(2, '0')}:${chance.integer({ min: 0, max: 59 }).toString().padStart(2, '0')}:${chance.integer({ min: 0, max: 59 }).toString().padStart(2, '0')}.000+00:00`,
    },
    {
      accion: chance.pickone(['Pagado', 'Pagado', 'Pagado', 'Domiciliado devuelto', 'Impagado']),
      fecha: `${chance.integer({ min: 2015, max: 2023 })}-${chance.integer({ min: 1, max: 12 }).toString().padStart(2, '0')}-${chance.integer({ min: 1, max: 28 }).toString().padStart(2, '0')}T${chance.integer({ min: 0, max: 23 }).toString().padStart(2, '0')}:${chance.integer({ min: 0, max: 59 }).toString().padStart(2, '0')}:${chance.integer({ min: 0, max: 59 }).toString().padStart(2, '0')}.000+00:00`,
    },
  ],
});
