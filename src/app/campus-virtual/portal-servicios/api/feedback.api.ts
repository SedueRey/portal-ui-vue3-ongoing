import { apiRequest, baseApiURL } from '@/api';

const apiVersion = 'v2';

const endpoints = {
  feedback: `${baseApiURL}/aulavirtual/portal-api/private/${apiVersion}/addratingtool`,
};

const apiumApi = {
  endpoints: () => {},
  sendFeedback: (params) => {
    const url = endpoints.feedback;
    return apiRequest({
      method: 'POST',
      data: params,
      url,
    });
  },
};

export default apiumApi;
