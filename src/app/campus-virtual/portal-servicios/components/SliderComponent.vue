<template>
  <div v-show="mustShow" class="cardGroupList" :class="className">
    <section class="cardGroupList__item" v-if="!isEmpty() && mustShow">
      <h1 class="cardGroup__title" :title="$t(`${pSliderKey}.title`)">
        {{ $t(`${pSliderKey}.title`) }}
      </h1>
      <card-group
        :services="pServices"
        :slider-key="pSliderKey"
        :view-type="pViewType"
        :tidy="pTidy"
        :small-cards="pSmallCards || false"
        :options="optionsAdded"
        @pageActiveChange="getPage"
      />
    </section>
  </div>
</template>

<script setup lang="ts">
  import type { AreaServiceItems, SliderOptions } from '../portal-servicios.types';
  import { computed, onMounted, ref, watch } from 'vue';
  import CardGroup from './CardGroup.vue';
  import { storeToRefs } from 'pinia';
  import { useAuthStore } from '@/app/auth/store/auth';
  import { useServicesStore } from '../store/services';
  import { useUserStore } from '@/app/user/store/user';

  const props = withDefaults(
    defineProps<{
      pOrder: number;
      pViewType: string;
      pVisible: boolean;
      pPrivate: boolean;
      pServices: AreaServiceItems[];
      pSliderKey: string;
      pTidy: boolean;
      pParam: string;
      pOptions: SliderOptions[];
      pRoles: string[];
      pSmallCards?: boolean;
    }>(),
    {
      pSmallCards: false,
    },
  );

  const sliderKey = ref(props.pSliderKey);
  //c onst sliderAction = ref('setCardList');
  const sliderParam = ref(props.pParam);
  const pageText = ref('');

  const { isLogged, token } = storeToRefs(useAuthStore());
  const { isNewUser } = storeToRefs(useUserStore());
  const { areas } = storeToRefs(useServicesStore());

  const mustShow = computed(() => {
    if (isNewUser.value && sliderKey.value === 'NEW_SERVICES') {
      return false;
    }
    const isForMe = true;
    return isLogged.value ? props.pVisible && isForMe : !props.pPrivate && props.pVisible;
  });

  const className = computed(() => sliderKey.value.toLowerCase().replace(/_/gi, '-'));

  const optionsAdded = computed(() => ({
    sliderKey: sliderKey.value,
    sliderAction: 'setCardList',
    sliderParam: sliderParam.value,
    options: [...(Object.values(props.pOptions) || [])],
  }));

  const fullSlider = () => areas.value[sliderKey.value];

  const isEmpty = () => {
    const fs = fullSlider().services || [];
    return fs.length === 0;
  };

  const getPage = (value) => {
    pageText.value = value;
  };
  /*
  const reorderSlider = () => {
    useServicesStore().setCardList({
      type: sliderKey.value,
      param: sliderParam.value,
    });
  };*/

  const getServiceData = () => {
    if (isLogged.value || !props.pPrivate) {
      window.setTimeout(() => {
        useServicesStore().setCardList({
          type: sliderKey.value,
          param: sliderParam.value,
        });
      }, 500);
    }
  };
  /*
  const toggleVisibility = (key) => {
    useServicesStore().toggleVisibility(key);
  };*/

  onMounted(() => {
    if (props.pServices.length === 0) {
      getServiceData();
    }
  });

  watch(token, () => {
    getServiceData();
  });
</script>

<style lang="scss">
  .cardGroup__orderselectlabel {
    position: absolute;
    right: 21rem;
    top: 10px;
    font-size: 0.9rem;
    opacity: 0;
    transition: linear 0.25s opacity;
    @media (max-width: $screen-sm-min) {
      position: inherit;
    }
    select {
      padding: 0.2rem;
      margin: 0 0 0 0.25rem;
    }
  }
  .cardGroup__viewIcon {
    display: none;
    font-weight: bolder;
    &__bar {
      margin-left: -1em;
    }
  }
  .cardGroup__title {
    color: var(--title-color);
    font-family: var(--font-family);
    font-weight: 700;
    font-size: 1.5rem;
    line-height: 1;
    margin: 0 0 0 0;
    padding: 0.3rem 1rem 0.4rem 0.375rem;
    @media (max-width: $screen-sm-min) {
      padding: 0.35rem 1rem 0.45rem 0.375rem;
      font-size: 1.15rem;
      max-width: calc(100vw - 5rem);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
  .cardGroup__titlePage {
    opacity: 0.85;
    font-size: 1rem;
    font-weight: 400;
  }
  .cardGroup__hideIcon {
    cursor: pointer;
  }
  .cardGroupList {
    list-style: none;
    margin: 0 0 0 0;
    padding: 0 1rem 0rem 1rem;
    position: relative;
    .sideMenu {
      opacity: 1;
    }
    .cardCarousel__nav__left,
    .cardCarousel__nav__right {
      display: block;
      @media (max-width: $screen-sm-min) {
        display: none;
      }
    }
    &.starred-services {
      @media (max-width: $screen-sm-min) {
        background-color: var(--card-bg-color);
        margin-bottom: 1rem;
      }
    }
    &.new-services {
      .card__newicon {
        display: none;
      }
    }
    &__item {
      max-width: var(--grid-width);
      margin: 0 auto;
    }
  }
  .cardGroup__viewIcon__eye {
    cursor: pointer;
    font-weight: bolder;
    position: relative;
    z-index: 1;
  }
</style>
