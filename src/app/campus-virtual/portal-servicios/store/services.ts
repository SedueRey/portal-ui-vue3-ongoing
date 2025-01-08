import type { MinimalSlider, SearchServiceItems, Slider } from '../portal-servicios.types';
import type {
  PortalServiciosBasicServiceResponse,
  PortalServiciosServiceResponse,
  PortalServiciosSliderInfoResponse,
} from '../api/portal-servicios.contracts';
import { ref, type Ref } from 'vue';
import { defineStore } from 'pinia';
import servicesApi from '../api/services.api';
import slidersDefinition from '../models/services';
import { useAuthStore } from '@/app/auth/store/auth';
import { usePageStore } from '@/app/shared/store/pages';

const newArea: Slider = {
  order: 0,
  private: true,
  services: [],
  sliderKey: '',
  tidy: false,
  viewType: 'carousel',
  scion: false,
  param: '',
  options: null,
  visible: false,
  howMany: '',
  tag: '',
  orderParams: [],
  smallCards: false,
  loaded: true,
  roleName: [],
};

export const useServicesStore = defineStore('services', () => {
  // State
  const cards: Ref<PortalServiciosBasicServiceResponse[]> = ref([]);
  const indice: Ref<number> = ref(0);
  const loadingSliders: Ref<boolean> = ref(true);
  const areas = ref(structuredClone(slidersDefinition));
  const searchedServices: Ref<SearchServiceItems[]> = ref([]);
  const single: Ref<PortalServiciosServiceResponse | null> = ref(null);
  const service: Ref<PortalServiciosServiceResponse | null> = ref(null);
  const maximizeEvents: Ref<boolean> = ref(false);
  // Mutations
  // Comprobar si se sigue utilizando
  const searchedItemsMutation = (serviceList: PortalServiciosServiceResponse[]) => {
    for (let i = 0; i < serviceList.length; i += 1) {
      const serviceId = serviceList[i].identifier;
      const idSearch = serviceList[i].searchId;
      if (searchedServices.value.filter((el) => el.serviceId === serviceId).length === 1) {
        const foundIndex = searchedServices.value.findIndex((el) => el.serviceId === serviceId);
        searchedServices.value[foundIndex].searchId = idSearch;
      } else {
        searchedServices.value.push({
          serviceId,
          searchId: idSearch,
        });
      }
    }
  };
  const setSliderMutation = (slider) => {
    if (areas.value[slider.sliderKey] === undefined) {
      const newId = Object.keys(areas.value).length;
      const newKey = slider.sliderKey;
      areas.value[newKey] = { ...newArea, order: newId, ...newKey, ...slider, loaded: true };
    } else {
      areas.value[slider.sliderKey] = { ...areas.value[slider.sliderKey], ...slider, loaded: true };
    }
  };
  const _setCardMutation = (card: PortalServiciosBasicServiceResponse) => {
    if (cards.value.filter((el) => el.identifier === card.identifier).length === 0) {
      if (card.scion === false) {
        cards.value.push(card);
      }
    }
  };
  const _setCardDetailMutation = (card: PortalServiciosBasicServiceResponse) => {
    if (cards.value.filter((el) => el.identifier === card.identifier).length === 0) {
      cards.value.push(card);
    } else {
      const itemIndex = cards.value.findIndex((el) => el.identifier === card.identifier);
      const timeStamp = Date.now();
      cards.value[itemIndex] = { ...card, updated: timeStamp, complete: true };
      // Las dos siguientes líneas son necesarias para que Pinia se entere de que se ha modificado
      // el array y se haga propagación de datos. Se supone que en Vue 3 esto estará mejor.
      cards.value.push();
      cards.value.splice(-1, 1);
    }
  };
  const _toggleStarredMutation = (serviceUuid: string) => {
    const currentArea = areas.value.STARRED_SERVICES;
    if (currentArea.services.filter((el) => el.identifier === serviceUuid).length === 0) {
      const newElement = currentArea.services.map((InnerService) => ({
        identifier: InnerService.identifier,
        order: InnerService.order + 1,
      }));
      currentArea.services = [...newElement];
      currentArea.services.unshift({
        identifier: serviceUuid,
        order: 0,
      });
    } else {
      const index = currentArea.services.findIndex((el) => el.identifier === serviceUuid);
      currentArea.services = [
        ...currentArea.services.slice(0, index),
        ...currentArea.services.slice(index + 1),
      ];
    }
    areas.value.STARRED_SERVICES = { ...currentArea };
  };
  const _toggleRecommendMutation = (serviceUuid: string) => {
    const currentArea = areas.value.UMRECOMMENDED;
    if (
      currentArea &&
      currentArea.services.filter((el) => el.identifier === serviceUuid).length === 0
    ) {
      const newElement = currentArea.services.map((InnerService) => ({
        identifier: InnerService.identifier,
        order: InnerService.order + 1,
      }));
      currentArea.services = [...newElement];
      currentArea.services.unshift({
        identifier: serviceUuid,
        order: 0,
      });
    } else if (currentArea) {
      const index = currentArea.services.findIndex((el) => el.identifier === serviceUuid);
      currentArea.services = [
        ...currentArea.services.slice(0, index),
        ...currentArea.services.slice(index + 1),
      ];
    }
    if (areas.value.UMRECOMMENDED) {
      areas.value.UMRECOMMENDED = { ...newArea, ...currentArea };
    }
  };
  const toggleSliderVisiblityMutation = (sliderKey) => {
    if (areas.value[sliderKey] !== undefined) {
      areas.value[sliderKey].visible = !areas.value[sliderKey].visible;
    }
  };
  const showSliderVisibilityMutation = (sliderKey) => {
    if (areas.value[sliderKey] !== undefined) {
      areas.value[sliderKey].visible = true;
    }
  };
  // Acciones
  const setCardList = (service) => {
    const { viewType, howMany, tag } = areas.value[service.type];
    const isLogged = useAuthStore().isLogged;
    // POSE-859 - Desactivamos los carriles por rol hasta que se definan.
    const isForMe = true;
    if (isLogged && !isForMe) {
      const timeStamp = new Date().getTime();
      setSliderMutation({
        sliderKey: service.type,
        services: [],
        updated: timeStamp,
        viewType,
      });
    } else {
      servicesApi
        .lazySlider({
          service,
          isLogged,
          howMany,
          tag,
        })
        .then((r) => r.data)
        .then((cards) => {
          const cardsVisibles = cards.filter((el) => el.scion === false);
          const timeStamp = Date.now();
          setSliderMutation({
            sliderKey: service.type,
            services: cardsVisibles,
            updated: timeStamp,
            viewType,
          });
          for (let i = 0; i < cardsVisibles.length; i += 1) {
            const card = cardsVisibles[i];
            if (['STARRED_SERVICES', 'UMRECOMMENDED'].includes(service.type)) {
              card.order = i;
            }
            _setCardMutation({ ...card, updated: timeStamp });
          }
        });
    }
  };
  const loadCard = (uuid: string) => {
    servicesApi
      .detailCard(uuid)
      .then((r) => r.data)
      .then((card) => {
        _setCardDetailMutation(card);
      });
  };
  const loadDetail = (uuid: string) => {
    servicesApi
      .detailCard(uuid)
      .then((r) => r.data)
      .then((serviceFromAPI) => {
        service.value = serviceFromAPI;
        usePageStore().setTitle(`${service.value?.name || ''}`);
      });
  };
  const loadDetailByURL = (url) => {
    servicesApi
      .detailCardByURL(url)
      .then((r) => r.data)
      .then((serviceFromAPI) => {
        service.value = serviceFromAPI;
        usePageStore().setTitle(`${service.value?.name || ''}`);
      })
      .catch(() => {
        servicesApi
          .detailCardByURL(`${url}/`)
          .then((r) => r.data)
          .then((serviceFromAPI) => {
            service.value = serviceFromAPI;
            usePageStore().setTitle(`${service.value?.name || ''}`);
          });
      });
  };
  const toStarred = (param) => {
    _toggleStarredMutation(param.serviceId);
    const starred = areas.value.STARRED_SERVICES.services.map((el) => ({
      identifier: el.identifier,
      order: `${el.order}`,
    }));
    servicesApi.setStarred(starred).catch(() => {
      _toggleStarredMutation(param.serviceId);
    });
  };
  const toRecommend = (param) => {
    if (areas.value.UMRECOMMENDED) {
      _toggleRecommendMutation(param.serviceId);
      const recommended = areas.value.UMRECOMMENDED.services.map((el) => ({
        identifier: el.identifier,
        order: `${el.order}`,
      }));
      servicesApi.setRecommend(recommended).catch(() => {
        _toggleRecommendMutation(param.serviceId);
      });
    }
  };
  const reorder = (data) => {
    const { arrayServices, sliderKey } = data;
    const slider = areas.value[sliderKey];
    const timeStamp = Date.now();
    setSliderMutation({
      sliderKey: slider.sliderKey,
      services: arrayServices,
      updated: timeStamp,
      viewType: slider.viewType,
    });
    if (sliderKey === 'STARRED_SERVICES') {
      servicesApi.setStarred(
        arrayServices.map((el) => ({
          identifier: el.identifier,
          order: `${el.order}`,
        })),
      );
    } else if (sliderKey === 'UMRECOMMENDED') {
      servicesApi.setRecommend(
        arrayServices.map((el) => ({
          identifier: el.identifier,
          order: `${el.order}`,
        })),
      );
    }
  };
  const setIsCarousel = (sliderData) => {
    const isItLogged = sliderData.logged;
    areas.value[sliderData.sliderKey].viewType = sliderData.viewType;
    if (isItLogged) {
      const sendSlider = Object.values(areas.value).map((el) => ({
        order: el.order,
        sliderKey: el.sliderKey,
        viewType: el.viewType,
        visible: el.visible ? '1' : '0',
      }));
      servicesApi.setSliders(sendSlider);
    }
  };
  const reorderSliders = (arraySliders) => {
    const timeStamp = Date.now();
    for (let i = 0; i < arraySliders.length; i += 1) {
      areas.value[arraySliders[i].sliderKey].order = arraySliders[i].order;
      areas.value[arraySliders[i].sliderKey].updated = timeStamp;
    }
    const sendSlider = Object.values(areas.value).map((el) => ({
      order: el.order,
      sliderKey: el.sliderKey,
      viewType: el.viewType,
      visible: el.visible ? '1' : '0',
    }));
    servicesApi.setSliders(sendSlider);
  };
  const toggleVisibility = (key) => {
    if (areas.value[key] !== undefined) {
      areas.value[key].visible = !areas.value[key].visible;
      const sendSlider = Object.values(areas.value).map((el) => ({
        order: el.order,
        sliderKey: el.sliderKey,
        viewType: el.viewType,
        visible: el.visible ? '1' : '0',
      }));
      servicesApi.setSliders(sendSlider).catch(() => {
        areas.value[key].visible = !areas.value[key].visible;
      });
    }
  };
  const showSliders = () => {
    Object.keys(areas.value).forEach((key) => {
      showSliderVisibilityMutation(key);
    });
    const sendSlider = Object.values(areas.value).map((el) => ({
      order: el.order,
      sliderKey: el.sliderKey,
      viewType: el.viewType,
      visible: '1',
    }));
    servicesApi.setSliders(sendSlider);
  };
  const getSlidersInfo = () => {
    loadingSliders.value = true;
    servicesApi
      .getSliders()
      .then((r) => r.data)
      .then((carouselList) => {
        // La estructura viene marcada por el backend
        const sliderList: MinimalSlider[] = carouselList.map(
          (slider: PortalServiciosSliderInfoResponse) => ({
            sliderKey: slider.sliderId.key,
            viewType: slider.type,
            order: slider.order,
            visible: slider.visible === '1',
          }),
        );
        const sliderKeys = Object.values(slidersDefinition).map((el) => el.sliderKey);
        Object.values(sliderList).forEach((slider) => {
          if (sliderKeys.includes(slider.sliderKey)) {
            setSliderMutation(slider);
          }
        });
        loadingSliders.value = true;
      });
  };
  const loadSingle = (uuid) => {
    servicesApi
      .detailCard(uuid)
      .then((r) => r.data)
      .then((serviceFromAPI) => {
        single.value = serviceFromAPI;
      });
  };
  return {
    // state
    areas,
    cards,
    indice,
    loadingSliders,
    searchedServices,
    single,
    service,
    maximizeEvents,
    // mutations
    searchedItemsMutation,
    setSliderMutation,
    showSliderVisibilityMutation,
    toggleSliderVisiblityMutation,
    // actions
    getSlidersInfo,
    loadCard,
    loadDetail,
    loadDetailByURL,
    loadSingle,
    reorder,
    reorderSliders,
    setCardList,
    setIsCarousel,
    showSliders,
    toggleVisibility,
    toRecommend,
    toStarred,
    // getters
  };
});
