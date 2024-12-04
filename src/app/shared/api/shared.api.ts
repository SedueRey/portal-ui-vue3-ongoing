import { apiRequest, baseApiURL } from '@/api';

const apiVersion = 'v2';
const apiNotimovilVersion = 'v3.0';

const endpoints = {
  changeNotifications: `${baseApiURL}/cidu/notimovil-api/private/${apiNotimovilVersion}/alertas/estado`,
  notifications: `${baseApiURL}/cidu/notimovil-api/private/${apiNotimovilVersion}/alertas`,
  setLanguage: `${baseApiURL}/aulavirtual/portal-api/private/${apiVersion}/language`,
  widget: `${baseApiURL}/aulavirtual/portal-api/public/${apiVersion}/widgets`,
};

const sharedApi = {
  endpoints: () => endpoints,
  markAsReadNotification: (idNoti) => {
    const url = endpoints.changeNotifications;
    const serviceData = {
      ids_alerta: [idNoti],
      estado: 'LE',
    };
    return apiRequest({
      method: 'PUT',
      data: serviceData,
      url,
    });
  },
  markAllAsReadNotification: (notis) => {
    const url = endpoints.changeNotifications;
    const serviceData = {
      ids_alerta: [...new Set(notis)],
      estado: 'LE',
    };
    return apiRequest({
      method: 'PUT',
      data: serviceData,
      url,
    });
  },
  notifications: (estado, page, size) => {
    const fechaDesde = new Date();
    const fechaTexto = `${fechaDesde.getUTCDate()}/${fechaDesde.getUTCMonth()}/${
      fechaDesde.getUTCFullYear() - 1
    }`;
    const url = `${endpoints.notifications}?estados=${estado}&fecha_desde=${
      fechaTexto
    }%2000:00:00&page=${page}&size=${size}`;
    return apiRequest({ url });
  },
  setLanguage: (lang) => {
    const url = endpoints.setLanguage;
    return apiRequest({
      method: 'POST',
      data: {
        inLanguage: lang,
      },
      url,
    });
  },
  widget: () => {
    const url = endpoints.widget;
    return apiRequest({
      url,
    });
  },
};

export default sharedApi;
