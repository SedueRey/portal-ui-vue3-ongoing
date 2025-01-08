import { type ApiumCategory } from '../portal-servicios.types';

const apiumCategories: { [key: number]: ApiumCategory } = {
  1: {
    id: 1,
    name: 'Actividad académica',
    color: 'var(--category1-color)',
  },
  2: {
    id: 2,
    name: 'Investigación',
    color: 'var(--category2-color)',
  },
  3: {
    id: 3,
    name: 'Vida Universitaria',
    color: 'var(--category3-color)',
  },
  4: {
    id: 4,
    name: 'Gestión',
    color: 'var(--category4-color)',
  },
  5: {
    id: 5,
    name: 'Utilidades',
    color: 'var(--category5-color)',
  },
};

export { apiumCategories as default };
