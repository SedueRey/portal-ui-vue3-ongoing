import { apiRequest, baseApiURL } from '@/api';

const apiVersion = 'v2';

const endpoints = {
  totalapium: `${baseApiURL}/aulavirtual/portal-api/private/${apiVersion}/totalapium`,
  incrementalapium: `${baseApiURL}/aulavirtual/portal-api/private/${apiVersion}/incrementalapium`,
};

const apiumApi = {
  endpoints: () => endpoints,
  totalapium: () => {
    const url = endpoints.totalapium;
    return apiRequest({
      method: 'POST',
      data: {},
      url,
    });
  },
  incrementalapium: () => {
    const url = endpoints.incrementalapium;
    return apiRequest({
      method: 'POST',
      data: {},
      url,
    });
  },
};

export default apiumApi;
