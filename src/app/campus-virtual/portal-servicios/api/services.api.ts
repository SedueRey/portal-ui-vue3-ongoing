import { apiRequest, baseApiURL } from '@/api';

const apiVersion = 'v2';

const endpoints = {
  detail: `${baseApiURL}/aulavirtual/portal-api/public/${apiVersion}/servicios/`,
  detailByURL: `${baseApiURL}/aulavirtual/portal-api/private/${apiVersion}/servicesurl`,
  getRelated: `${baseApiURL}/aulavirtual/portal-api/public/${apiVersion}/related`,
  getRelatedByUser: `${baseApiURL}/aulavirtual/portal-api/private/${apiVersion}/relatedbyuser`,
  lazy: {
    sliders: {
      ALL_SERVICES: `${baseApiURL}/aulavirtual/portal-api/private/${apiVersion}/allservicesbyuser`,
      STARRED_SERVICES: `${baseApiURL}/aulavirtual/portal-api/private/${apiVersion}/getstarred`, // de back a front
      MOST_USED_SERVICES: `${baseApiURL}/aulavirtual/portal-api/private/${apiVersion}/mostvisited`,
      RECENT_SERVICES: `${baseApiURL}/aulavirtual/portal-api/private/${apiVersion}/lastvisited`,
      RECOMMENDED: `${baseApiURL}/aulavirtual/portal-api/private/${apiVersion}/recommended`,
      TAG_UTILIDADES: `${baseApiURL}/aulavirtual/portal-api/public/${apiVersion}/servicesbytag`,
      TAG_ITINERARIOS_IMPRIMIR: `${baseApiURL}/aulavirtual/portal-api/public/${apiVersion}/servicesbytag`,
      NEW_SERVICES: `${baseApiURL}/aulavirtual/portal-api/private/${apiVersion}/newservices`,
    },
    sliderAlternative: {
      ALL_SERVICES: `${baseApiURL}/aulavirtual/portal-api/private/${apiVersion}/allservicesbyuser`,
      TAG_UTILIDADES: `${baseApiURL}/aulavirtual/portal-api/private/${apiVersion}/servicesbytagbyuser`,
      TAG_ITINERARIOS_IMPRIMIR: `${baseApiURL}/aulavirtual/portal-api/private/${apiVersion}/servicesbytagbyuser`,
    },
    setStarred: `${baseApiURL}/aulavirtual/portal-api/private/${apiVersion}/setstarred`,
    setRecommend: `${baseApiURL}/aulavirtual/portal-api/private/${apiVersion}/setumrecommended`,
    setSliders: `${baseApiURL}/aulavirtual/portal-api/private/${apiVersion}/setslider`,
    getSliders: `${baseApiURL}/aulavirtual/portal-api/private/${apiVersion}/getslider`,
  },
  search: `${baseApiURL}/aulavirtual/portal-api/private/${apiVersion}/search`,
  searchuser: `${baseApiURL}/aulavirtual/portal-api/private/${apiVersion}/searchbyuser`,
};

const servicesApi = {
  endpoints: () => endpoints,
  detailCard: (detail = '') => {
    const url = `${endpoints.detail}${detail}`;
    return apiRequest({ url });
  },
  detailCardByURL: (urlService = '') => {
    const urlModified =
      process.env.NODE_ENV === 'development'
        ? urlService.replace(
            `${process.env.VITE_APP_LOCAL_URL}:${window.location.port}`,
            process.env.VITE_APP_API_ENVIRONMENT || '',
          )
        : urlService;
    const url = `${endpoints.detailByURL}/${btoa(urlModified)}`;
    return apiRequest({ url });
  },
  getRelatedServices: (serviceId, isLogged = false) => {
    const numServices = 9;
    const url = isLogged
      ? `${endpoints.getRelated}/${serviceId}/sortByAlphabetic?result=${numServices}`
      : `${endpoints.getRelatedByUser}/${serviceId}/sortByAlphabetic?result=${numServices}`;
    return apiRequest({ url });
  },
  getSliders: () => apiRequest({ url: endpoints.lazy.getSliders }),
  lazySlider: (params) => {
    const { service, isLogged, howMany, tag } = params;
    // const useruuid = localStorage.getItem('p15s-useruuid') || '';
    const { param } = service;
    /*
    if (useruuid !== '') {
      const paramFromStorage = localStorage.getItem(useruuid) || '';
      if (paramFromStorage.trim() !== '' && service.type === paramFromStorage.key) {
        param = paramFromStorage.param;
      }
    }
    */
    const tagsUtil = tag !== '' ? `?tag=${tag.split(',').join('&tag=')}` : '';
    const url =
      isLogged && service.type in endpoints.lazy.sliderAlternative
        ? `${endpoints.lazy.sliderAlternative[service.type]}${param}${howMany}${tagsUtil}`
        : `${endpoints.lazy.sliders[service.type]}${param}${howMany}${tagsUtil}`;
    return apiRequest({ url });
  },
  setStarred: (sliderServices) => {
    const url = endpoints.lazy.setStarred;
    return apiRequest({
      method: 'POST',
      data: sliderServices,
      url,
    });
  },
  setRecommend: (sliderServices) => {
    const url = endpoints.lazy.setRecommend;
    return apiRequest({
      method: 'POST',
      data: sliderServices,
      url,
    });
  },
  setSliders: (sliders) => {
    const url = endpoints.lazy.setSliders;
    return apiRequest({
      method: 'POST',
      data: sliders,
      url,
    });
  },
  search: (searchParameters) => {
    const { tag, logged } = searchParameters;
    const endpoint = logged ? endpoints.searchuser : endpoints.search;
    return apiRequest({ url: `${endpoint}/?search=${tag}` });
  },
};

export default servicesApi;
