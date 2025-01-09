<template>
  <div class="cardGroup" v-if="services">
    <CardGroupCarousel
      v-if="isCarousel"
      @carouselView="carouselView"
      :services="filteredServices"
      :tidy="tidy"
      :small-cards="smallCards"
      :options="options"
      @pageActiveChange="getPage"
      @carouselFilter="filterCategory"
    />
    <CardGroupOpened
      v-else
      @carouselView="carouselView"
      :service-list="filteredServices"
      :tidy="tidy"
      :small-cards="smallCards"
      :options="options"
      @pageActiveChange="getPage"
      @carouselFilter="filterCategory"
    />
    <fwjs-message
      v-if="filteredServices.length === 0"
      :text="errorMsg.textMsg"
      :category="errorMsg.categoryMsg"
      class="cardGroup__message"
    />
  </div>
</template>

<script lang="ts" setup>
  import type { AreaServiceItems, SliderConfig } from '../portal-servicios.types';
  import { computed, ref } from 'vue';
  import CardGroupCarousel from './CardGroupCarousel.vue';
  import CardGroupOpened from './CardGroupOpened.vue';
  import fwjsMessage from '@/app/shared/components/fwjsMessage.vue';
  import { useAuthStore } from '@/app/auth/store/auth';
  import { useI18n } from 'vue-i18n';
  import { useServicesStore } from '@/app/campus-virtual/portal-servicios/store/services';

  const props = withDefaults(
    defineProps<{
      sliderKey: string;
      viewType: string;
      tidy: boolean;
      options: SliderConfig;
      smallCards?: boolean;
      services: AreaServiceItems[];
    }>(),
    {
      smallCards: false,
    },
  );

  const emit = defineEmits(['pageActiveChange']);
  const { t } = useI18n();

  const filteredCategory = ref('');
  const errorMsg = {
    textMsg: t('noitems'),
    categoryMsg: 'info',
  };

  const isCarousel = computed(() => {
    return props.viewType === 'carousel' && props.services.length > 4 && !props.tidy;
  });

  const filteredServices = computed(() => {
    const filterApply = `${filteredCategory.value}`;
    return filteredCategory.value === ''
      ? props.services
      : props.services.filter(
          (e) => (e.category && e.category[0] ? e.category[0].identifier : '') === filterApply,
        );
  });

  const carouselView = (value) => {
    useServicesStore().setIsCarousel({
      sliderKey: props.sliderKey,
      viewType: value,
      logged: useAuthStore().isLogged,
    });
  };

  const getPage = (value) => {
    emit('pageActiveChange', value);
  };

  const filterCategory = (catId) => {
    filteredCategory.value = catId;
    window.sessionStorage.setItem(`ORDER_${props.sliderKey}`, catId);
  };
</script>

<style lang="scss" scoped>
  .cardGroup {
    max-width: var(--grid-width);
    margin: 0 auto;
    position: relative;

    &__title {
      font-family: var(--font-family);
      font-weight: 400;
      font-size: 3rem;
      margin: 0 0 0.7rem 0;
      padding: 0 0 0.5rem 6px;
      border-bottom: 1px solid var(--border-color);
      @media (max-width: $screen-sm-min) {
        font-size: 1.1rem;
      }
    }

    &__message {
      position: absolute;
      top: 30%;
      left: 50%;
      width: 80%;
      transform: translate(-50%, -30%);
    }
  }
</style>
