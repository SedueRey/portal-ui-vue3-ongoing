import { apiRequest, baseApiURL } from '@/api';

const apiVersion = 'v2';

const endpoints = {
  search: `${baseApiURL}/aulavirtual/portal-api/public/${apiVersion}/search`,
  searchuser: `${baseApiURL}/aulavirtual/portal-api/public/${apiVersion}/search`,
  suggestions: `${baseApiURL}/aulavirtual/portal-api/public/${apiVersion}/suggestion?suggestion=`,
};

const poseApi = {
  endpoints: () => endpoints,
  getSuggestions: (text) => {
    const url = endpoints.suggestions;
    return apiRequest({ url: `${url}${text}` });
  },
  search: (searchParameters) => {
    const { tag, logged } = searchParameters;
    const endpoint = logged ? endpoints.searchuser : endpoints.search;
    return apiRequest({ url: `${endpoint}/?search=${tag}` });
  },
};

export default poseApi;
