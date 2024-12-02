import axios, { type ResponseType } from 'axios';

const baseApiURL = '';
const environmentURL =
  window._env_ && window._env_.API_UM_URL
    ? window._env_.API_UM_URL
    : window._env_.POSE_API_URL.replace('micampus', 'api');

const shouldProxy = (url) => {
  const localEnvironment = import.meta.env.NODE_ENV !== 'production';
  let root = false;
  let proxyURL = '';
  if (localEnvironment) {
    const localBackendURLComponentePagoAcade = (urlComponentePagoAcade) =>
      urlComponentePagoAcade.includes('/acade-tramites-api/');
    const localBackendURL =
      (localBackendURLComponentePagoAcade(url)
        ? import.meta.env.VITE_APP_BACKEND_COMPONENTE
        : import.meta.env.VITE_APP_BACKEND) || '';
    let localBackendRoutes = import.meta.env.VITE_APP_BACKEND_ROUTES || [];
    try {
      localBackendRoutes = localBackendRoutes.split(' ');
    } catch {
      localBackendRoutes = [];
    }
    const needsProxy = localBackendRoutes.filter((el) => url.indexOf(el) !== -1).length === 1;
    if (localBackendURL !== '' && needsProxy) {
      root = true;
      proxyURL = `${localBackendURL}`;
    }
  }
  return {
    root,
    proxyURL,
  };
};

const apiRequest = ({ method = 'GET', data = {}, url, responseType = 'json' as ResponseType }) => {
  const { root, proxyURL } = shouldProxy(url);
  return axios({
    url: `${root ? proxyURL : environmentURL || ''}${url}`,
    method,
    data,
    responseType,
  }).catch((error) => {
    throw error;
  });
};

// Podemos usarlo para llamadas a mocks locales
// para testear la interfaz con JSONs
const localApiMockRequest = ({ method = 'GET', url, responseType = 'json' as ResponseType }) =>
  axios({
    url,
    method,
    responseType,
  }).catch((error) => {
    throw error;
  });

export { apiRequest, localApiMockRequest, baseApiURL, environmentURL };
