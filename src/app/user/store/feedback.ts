import { type Ref, ref } from 'vue';
import { defineStore } from 'pinia';
import type { PortalServiciosServiceResponse } from '@/app/campus-virtual/portal-servicios/api/portal-servicios.contracts';

export const useFeedbackStore = defineStore('feedback', () => {
  const lastBeaconService: Ref<PortalServiciosServiceResponse | null> = ref(null);
  return {
    lastBeaconService,
  };
});
