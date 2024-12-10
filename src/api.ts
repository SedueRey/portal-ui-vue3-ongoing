import axios, { type ResponseType } from 'axios';
import { useAuthStore } from './app/auth/store/auth';

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

/* AUTH Auth CUSTOM */
axios.interceptors.request.use(
  (config) => {
    // Do something before request is sent
    const bearer = useAuthStore().token || '';
    // Do not include the bearer token if we are invoking CAS
    const isCasRequest = config.url?.includes(useAuthStore().cas);
    if (bearer !== '' && !isCasRequest) {
      config.headers.Authorization = `Bearer ${bearer}`;
    }
    if (config.method === 'post' && !config.headers['Content-Type']) {
      config.headers['Content-Type'] = 'application/json; charset=utf-8';
    }
    const umsessionID = useAuthStore().sessionID || '';
    // const urlBackend = process.env.VITE_APP_BACKEND || '';
    const needsHeader = config.url?.indexOf(window._env_.API_UM_URL) !== -1;
    if (needsHeader && umsessionID !== '') {
      config.headers['UMU-User-SessionID'] = umsessionID;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

const errorResponseHandler = (error) => {
  if (!error.code || error.code !== 'ECONNABORTED') {
    // Do something with response error
    const status = error.response ? error.response.status : 401;
    // Check insufficient LoA
    if (
      status === 401 &&
      error.response &&
      error.response.headers['umu-authenticate'] &&
      error.response.headers['umu-authenticate'] === 'invalid_loa_claim'
    ) {
      useAuthStore().set2faNeeded(true);
    } else if (!error.response || [401, 408, 504].includes(status)) {
      useAuthStore().revokeToken();
      useAuthStore().login();
    }
  }
  return Promise.reject(error);
};

axios.interceptors.response.use((response) => response, errorResponseHandler);

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
