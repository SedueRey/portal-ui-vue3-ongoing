<template>
  <span class="buttonStarred" v-if="props.serviceId && isLogged" :title="fillTitleInfo">
    <span
      class="buttonStarred__link"
      :class="activeClass"
      @click.prevent="toggleStarred()"
      @keyup.enter="toggleStarred"
      @keyup.space="toggleStarred"
      tabindex="0"
    >
      <i v-if="isStarred" class="fas fa-heart" />
      <i v-else class="far fa-heart" />
    </span>
  </span>
</template>

<script setup lang="ts">
  import { computed } from 'vue';
  import { storeToRefs } from 'pinia';
  import { useAuthStore } from '@/app/auth/store/auth';
  import { useI18n } from 'vue-i18n';
  import { useServicesStore } from '@/app/campus-virtual/portal-servicios/store/services';

  const props = defineProps({
    serviceId: { type: String, default: '' },
    serviceName: { type: String, required: true },
  });

  const { t } = useI18n();
  const authStore = useAuthStore();
  const serviceStore = useServicesStore();
  const sliderKey = 'STARRED_SERVICES';

  const { isLogged } = storeToRefs(authStore);
  const { areas } = storeToRefs(serviceStore);

  const isStarred = computed(() => {
    const allStarredIHave = areas.value[sliderKey];
    return allStarredIHave.services.filter((x) => x.identifier === props.serviceId).length > 0;
  });

  const activeClass = computed(() => (isStarred.value ? 'buttonStarred__is_active' : ''));

  const fillTitleInfo = computed(() => {
    return !isStarred.value
      ? `${t('highlight')} ${props.serviceName}`
      : `${t('remove')} ${props.serviceName} ${t('favourites')}`;
  });

  const toggleStarred = () => {
    const datosAMandar = {
      serviceId: props.serviceId,
    };
    useServicesStore().toStarred(datosAMandar);
  };
</script>

<i18n>
{
  "en": {
     "highlight": "Highlight",
     "remove": "Remove",
     "favourites": "from shortcuts"
  },
  "es": {
    "highlight": "Destacar",
    "remove": "Eliminar",
    "favourites": "de favoritos"
  }
}
</i18n>

<style lang="scss" scoped>
  .buttonStarred {
    &__link {
      color: var(--title-color);
      font-size: 1rem;
      display: inline-block;
      cursor: pointer;
      text-decoration: none;
      transform: scale(1);
      opacity: 1;
      transform-origin: 50% 50%;
      transition: opacity 0.25s linear;
      position: relative;
      top: 1px;
      z-index: 9999;
      &:hover {
        opacity: 0.75;
      }
    }
    &__is_active {
      color: var(--main-color);
      &:hover {
        opacity: 0.5;
      }
    }
  }
</style>
