import { environmentURL } from '@/api';
import { storeToRefs } from 'pinia';
import { useAuthStore } from '@/app/auth/store/auth';
import { useFeedbackStore } from '@/app/user/store/feedback';
import { useServicesStore } from '@/app/campus-virtual/portal-servicios/store/services';

export function useBeacon() {
  const { searchedServices } = storeToRefs(useServicesStore());
  const { service } = storeToRefs(useServicesStore());
  const { token } = storeToRefs(useAuthStore());
  const { lastBeaconService } = storeToRefs(useFeedbackStore());

  const beacon = (event) => {
    lastBeaconService.value = service.value;
    const isActive = process.env.NODE_ENV === 'production';
    const shouldSendBeacon =
      'sendBeacon' in navigator && isActive === true && !!event.type && !!token.value;
    if (shouldSendBeacon) {
      const formData = new FormData();
      const serviceId = service.value?.identifier;
      if (!!serviceId && !!token.value) {
        formData.append('identifier', serviceId);
        formData.append('token', token.value);
        formData.append('eventtype', event.type);
        const searchIdArray = searchedServices.value.find((el) => el.serviceId === serviceId);
        const searchIdValue = searchIdArray !== undefined ? searchIdArray.searchId : null;
        if (searchIdValue) {
          formData.append('searchid', `${searchIdValue}`);
        }
        navigator.sendBeacon(
          `${environmentURL}/aulavirtual/portal-api/public/v2/event/beacon/`,
          formData,
        );
      }
    }
  };

  return {
    searchedServices,
    beacon,
  };
}
