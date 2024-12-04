import { apiRequest, baseApiURL, environmentURL } from '@/api';

const apiVersion = 'v2';
const apiNotimovilVersion = 'v3.0';

const endpoints = {
  getconfignotifications: `${baseApiURL}/cidu/notimovil-api/private/${apiNotimovilVersion}/categorias/usuarios`,
  setconfignotifications: `${baseApiURL}/cidu/notimovil-api/private/${apiNotimovilVersion}/categorias/usuarios`,
  userPhoto: `${baseApiURL}/aulavirtual/portal-api/private/v1/photo`,
  userPhotoAuthorization: `${baseApiURL}/aulavirtual/portal-api/private/v1/photo/authorization`,
  whoami: `${baseApiURL}/aulavirtual/portal-api/private/${apiVersion}/whoamiuserdata`,
  getEsAlumno: `${baseApiURL}/aulavirtual/portal-api/private/${apiVersion}/derecho/micampus/Derecho_ALU_OFICIAL`,
  baseApiURL,
  environmentURL,
};

const userApi = {
  endpoints: () => endpoints,
  getConfigNotifications: () => apiRequest({ url: endpoints.getconfignotifications }),
  setConfigNotifications: (noti) => {
    const url = endpoints.setconfignotifications;
    return apiRequest({
      method: 'PUT',
      data: noti,
      url,
    });
  },
  getUserPhotoAuthorization: () => apiRequest({ url: endpoints.userPhotoAuthorization }),
  setUserPhotoAuthorization: (visible) =>
    apiRequest({
      url: `${endpoints.userPhotoAuthorization}?authorize=${visible}`,
      method: 'POST',
    }),
  setUserPhoto: (photoB64) =>
    apiRequest({
      url: endpoints.userPhoto,
      method: 'POST',
      data: {
        photo: photoB64,
      },
    }),
  whoAmI: () => {
    const url = endpoints.whoami;
    return apiRequest({ url });
  },
  esAlumno: () =>
    apiRequest({
      url: endpoints.getEsAlumno,
      method: 'GET',
    }),
};
export default userApi;
