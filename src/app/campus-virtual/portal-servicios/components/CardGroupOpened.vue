<template>
  <div class="openedCarousel" :class="getClass" v-if="serviceList">
    <side-menu
      v-if="showButton"
      class="openedCarousel__sideMenu"
      :show-less="true"
      :options="options"
      :can-carousel="canCarousel"
      :small-cards="smallCards || null"
      @carouselActivate="carouselView"
      @carouselFilter="carouselFilter"
    />
    <nav v-if="pagination" class="openedCarousel__pagination">
      {{ $t('pages', [page, pages]) }}
      <ol class="openedCarousel__paginationList">
        <li
          v-for="i in pages"
          :key="i"
          class="openedCarousel__paginationItem"
          :class="{ isActive: page === i }"
          @click="setPage(i, false)"
        >
          {{ i }}
        </li>
      </ol>
    </nav>
    <div class="openedCarousel__items" v-if="!isTidy">
      <lazy-card
        class="openedCarousel__item"
        v-for="item in serviceListCurated"
        :key="item.identifier"
        :service="item"
        :small="smallCards"
        :show-favourite="showFavourite"
        :should-load="shouldLoad"
      />
    </div>
    <div class="openedCarousel__items" v-else>
      <draggable
        v-if="!isMobile()"
        v-model="draggableServiceList"
        item-key="identifier"
        class="openedCarousel__draggable"
        tag="transition-group"
        ghost-class="ghost"
        @start="dragging = true"
        @end="dragging = false"
      >
        <template #item="{ element }">
          <lazy-card
            class="openedCarousel__item"
            :key="element.identifier"
            :service="element"
            :small="smallCards"
            :show-favourite="showFavourite"
            :should-load="shouldLoad"
          />
        </template>
      </draggable>
      <div v-else>
        <lazy-card
          class="openedCarousel__item"
          v-for="item in serviceListCurated"
          :key="item.identifier"
          :service="item"
          :small="smallCards"
          :show-favourite="showFavourite"
          :should-load="shouldLoad"
        />
      </div>
      <nav v-if="pagination" class="openedCarousel__pagination">
        {{ $t('pages', [page, pages]) }}
        <ol class="openedCarousel__paginationList">
          <li
            v-for="i in pages"
            :key="i"
            class="openedCarousel__paginationItem"
            :class="{ isActive: page === i }"
            @click="setPage(i)"
          >
            {{ i }}
          </li>
        </ol>
      </nav>
    </div>
  </div>
</template>

<script setup lang="ts">
  import type { CardItem, MinimalSlider, Slider, SliderConfig } from '../portal-servicios.types';
  import { computed, defineEmits, defineProps, onMounted, ref, type Ref } from 'vue';
  import draggable from 'vuedraggable';
  import SideMenu from './SideMenu.vue';
  import { useMobile } from '@/app/shared/composables/useMobile';
  import { useServicesStore } from '../store/services';

  // import LazyCard from './LazyCard.vue';

  const props = withDefaults(
    defineProps<{
      serviceList: CardItem[];
      pagination?: boolean;
      transformable?: boolean;
      tidy?: boolean;
      showDescription?: boolean;
      showButton?: boolean;
      smallCards?: boolean;
      options?: SliderConfig;
      showFavourite?: boolean;
      shouldLoad?: boolean;
    }>(),
    {
      pagination: false,
      transformable: true,
      tidy: false,
      showDescription: true,
      showButton: true,
      smallCards: false,
      showFavourite: true,
      shouldLoad: true,
    },
  );

  const { isMobile } = useMobile();

  const emit = defineEmits(['carouselView', 'carouselFilter', 'pageActiveChange']);

  const canCarousel = computed(
    () => props.serviceList.length > 4 && props.transformable && !isTidy.value,
  );
  const maxItems = 20;
  const page: Ref<number> = ref(1);
  const dragging: Ref<boolean> = ref(false);

  const isTidy = computed(() =>
    props.options && props.options.sliderKey === 'UMRECOMMENDED' ? false : props.tidy,
  );

  const serviceListCurated: Ref<CardItem[]> = computed(() => {
    return props.pagination
      ? props.serviceList.slice((page.value - 1) * maxItems, page.value * maxItems)
      : props.serviceList;
  });

  const draggableServiceList = computed({
    get() {
      return serviceListCurated.value;
    },
    set(value: Slider[]) {
      const newValueOrder: Slider[] | MinimalSlider[] = [];
      for (let i = 0; i < value.length; i += 1) {
        newValueOrder.push({
          ...value[i],
          order: i,
        });
      }
      if (props.options) {
        useServicesStore().reorder({
          arrayServices: newValueOrder,
          sliderKey: props.options.sliderKey,
        });
      }
    },
  });

  const pages = computed(() => {
    const pagesCount = Math.floor(props.serviceList.length / maxItems);
    return props.serviceList.length % maxItems === 0 ? pagesCount : pagesCount + 1;
  });

  const getClass = computed(() => (props.smallCards ? 'is-small' : ''));

  const carouselView = () => {
    emit('carouselView', 'carousel');
  };

  const carouselFilter = (evt) => {
    emit('carouselFilter', evt);
  };

  const setPage = (newPage, scrollable = true) => {
    if (scrollable) {
      const el = document.getElementsByClassName('openedCarousel__pagination')[0];
      const distanceToTop = Math.floor(el.getBoundingClientRect().top);
      window.scrollTo({ top: distanceToTop, left: 0, behavior: 'smooth' });
    }
    page.value = newPage;
  };

  onMounted(() => {
    emit('pageActiveChange', props.serviceList.length);
  });
</script>

<style lang="scss">
  .openedCarousel {
    position: relative;
    .cardGroupList {
      &:not(.starred-services) & {
        min-height: var(--carousel-height);
      }
    }

    &__pagination {
      text-align: center;
    }

    &__draggable {
      display: flex;
      flex-wrap: wrap;
      width: 100%;
      .card {
        cursor: move;
      }
    }

    &__paginationList {
      padding: 1rem 0 0 0;
      margin: 0 0 0 0;
      list-style: none;
    }

    &__paginationItem {
      background-color: var(--main-text-color);
      display: inline-block;
      margin: 0 0.5rem;
      padding: 0.5rem 0.8rem;
      color: var(--main-bg-color);
      cursor: pointer;
      user-select: none;
      @media (max-width: $screen-sm-min) {
        margin: 0 0.25rem;
        padding: 0.25rem 0.4rem;
      }
      &.isActive {
        background-color: var(--main-color);
        color: var(--main-bg-color);
      }
    }

    &__length {
      color: var(--title-color);
      display: block;
      font-size: 0.75rem;
      margin: -1rem 0 0 0;
      padding: 0 0 0 6px;
    }

    &__nav {
      position: absolute;
      top: -1rem;
      right: 6px;
      user-select: none;
      @media (max-width: $screen-phone) {
        display: block;
        margin: 1rem 0;
        position: initial;
        top: 0;
      }
    }

    &__items {
      display: flex;
      flex-direction: row;
      align-items: center;
      align-content: flex-start;
      justify-content: flex-start;
      margin: 1rem 0 2rem 0;
      flex-wrap: wrap;
      &:empty {
        min-height: var(--carousel-height);
      }
      > div {
        display: flex;
        @media (max-width: $screen-sm-min) {
          flex-direction: column;
        }
      }
    }

    &__item.card {
      max-width: var(--carousel-item-width);
      width: var(--carousel-item-width);
    }

    &__sideMenu {
      float: right;
      margin-top: -2.9rem;
      transition: linear 0.25s opacity;
      @media (max-width: $screen-sm-min) {
        margin-top: -3.45rem;
      }
    }
  }
  .openedCarousel__item.card.ghost {
    border: 2px dashed var(--border-color);
    background-color: transparent;
    > * {
      display: none;
    }
  }
</style>
