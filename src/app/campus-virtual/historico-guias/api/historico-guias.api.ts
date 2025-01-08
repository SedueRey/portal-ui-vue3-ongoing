import { apiRequest, environmentURL } from '@/api';

const moduleBaseApiURL = '/aulavirtual/historico-guias-docente-api/';
const apiVersion = 'v4';

const endpoints = {
  pdf: `${environmentURL}${moduleBaseApiURL}public/2/getpdf/`,
  search: `${moduleBaseApiURL}public/${apiVersion}/search/`,
  select: `${moduleBaseApiURL}public/${apiVersion}/select/`,
};

const syllabusApi = {
  endpoints: () => endpoints,
  searchSyllabus: (text) => {
    const url = `${endpoints.search}${text}`;
    return apiRequest({ url });
  },
  select: (type, id) => {
    const url = `${endpoints.select}${type}/${id}`;
    return apiRequest({ url });
  },
};

export default syllabusApi;
