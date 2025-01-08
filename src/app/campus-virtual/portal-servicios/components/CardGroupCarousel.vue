<template>
  <div class="cardCarousel__container">
    <nav class="cardCarousel__nav">
      <SideMenu
        class="cardCarousel__sideMenu"
        :show-more="true"
        :options="options"
        @carouselDeactivate="carouselView()"
        @carouselFilter="carouselFilter"
      />
      <button
        class="cardCarousel__nav__left"
        @click="moveCarousel(direction.prev)"
        :disabled="atHeadOfList"
        :title="$t('prev_acc')"
      />
      <button
        class="cardCarousel__nav__right"
        @click="moveCarousel(direction.next)"
        :disabled="atEndOfList"
        :title="$t('next_acc')"
      />
    </nav>
    <div class="cardCarousel__wrapperContainer">
      <div class="cardCarousel__wrapper" ref="carousel">
        <div v-touch:swipe="touchEvent" class="cardCarousel">
          <div class="cardCarousel__overflow-container">
            <div
              v-if="hasServices"
              class="cardCarousel__cards"
              :style="{ transform: 'translateX' + '(' + currentOffset + 'px' + ')' }"
            >
              <lazy-card
                class="cardCarousel__card"
                v-for="item in services"
                :service="item"
                :key="item.identifier"
                :small="smallCards"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import type { CardItem, SliderConfig } from '../portal-servicios.types';
  import { computed, onBeforeUnmount, onMounted, type Ref, ref, watch } from 'vue';
  import SideMenu from './SideMenu.vue';

  // import LazyCard from './LazyCard.vue';

  const props = defineProps<{
    tidy: boolean;
    options?: SliderConfig;
    services: CardItem[];
    smallCards?: boolean;
  }>();

  const emit = defineEmits(['carouselView', 'carouselFilter', 'pageActiveChange']);

  const currentOffset = ref(0);
  const startingPoint = ref(1);
  const windowSize = ref(4);
  const total = ref(0);
  const carousel: Ref<HTMLElement | null> = ref(null);
  const direction = {
    prev: -1,
    next: 1,
  };

  const atHeadOfList = computed(() => currentOffset.value === 0);
  const atEndOfList = computed(() => startingPoint.value >= total.value);
  const activePage = computed(() => `${startingPoint.value} / ${total.value}`);
  const hasServices = computed(() => props.services.length > 0);

  const paginationFactor = () => {
    const elementList = carousel.value;
    if (!elementList) return 0;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const element: any =
      elementList.getElementsByClassName('cardCarousel__card')[0] || document.createElement('div');
    const style = element.currentStyle || window.getComputedStyle(element);
    const width = parseInt(style.width.replace('px', ''), 10);
    const margin = parseFloat(style.marginLeft) + parseFloat(style.marginRight);
    const padding = parseFloat(style.paddingLeft) + parseFloat(style.paddingRight);
    return width + margin - padding;
  };

  const touchEvent = (direction) => {
    moveCarousel(direction === 'left' ? direction.next : direction.prev);
  };

  const carouselView = () => {
    emit('carouselView', 'opened');
  };

  const carouselFilter = (evt) => {
    emit('carouselFilter', evt);
  };

  const moveCarousel = (direction) => {
    const paginationFactorValue = paginationFactor();
    const scrollWidthValue = carousel.value
      ? Math.floor(carousel.value.clientWidth / paginationFactorValue)
      : 0;
    windowSize.value = scrollWidthValue;
    if (direction === direction.next && !atEndOfList.value) {
      currentOffset.value -= paginationFactorValue * scrollWidthValue;
      startingPoint.value += 1;
    } else if (direction === direction.prev && !atHeadOfList.value) {
      currentOffset.value += paginationFactorValue * scrollWidthValue;
      startingPoint.value -= 1;
    }
    emit('pageActiveChange', activePage.value);
  };

  const initWidths = () => {
    if (carousel.value) {
      const itemsPerPage = Math.floor(carousel.value.clientWidth / paginationFactor());
      windowSize.value = itemsPerPage;
      total.value = Math.ceil(props.services.length / itemsPerPage);
    }
  };

  const initPages = () => {
    currentOffset.value = 0;
    startingPoint.value = 1;
  };

  onMounted(() => {
    initWidths();
    initPages();
    emit('pageActiveChange', activePage.value);
    window.addEventListener('resize', initWidths);
  });

  onBeforeUnmount(() => {
    window.removeEventListener('resize', initWidths);
  });

  watch(
    () => props.services,
    () => {
      initPages();
      initWidths();
    },
    { deep: true },
  );
</script>

<i18n>
{
  "en": {
    "tidy": "Arrange",
    "tidy_acc": "Arrange",
    "showmore": "Show all elements",
    "showmore_acc": "Show all elements",
    "next": "Next",
    "next_acc": "Next page",
    "prev": "Prev",
    "prev_acc": "Previous page"
  },
  "es": {
    "tidy": "Ordenar",
    "tidy_acc": "Ordenar",
    "showmore": "Ver todos",
    "showmore_acc": "Ver todos los elementos",
    "next": "Siguiente",
    "next_acc": "Página siguiente",
    "prev": "Anterior",
    "prev_acc": "Página anterior"
  }
}
</i18n>

<style lang="scss" scoped>
  .cardCarousel {
    min-height: 254px;
    @media (max-width: $screen-xs-min) {
      min-height: 200px;
    }
    &__wrapper {
      display: flex;
      align-items: center;
      justify-content: flex-start;
      margin: 1.5rem 0 0 0;
    }

    &__wrapperContainer {
      width: 100%;
      overflow: hidden;
    }

    &__container {
      position: relative;
      top: -2.5rem;
    }

    &__overflow-container {
      overflow: hidden;
    }

    &__nav {
      user-select: none;
      height: 1.5rem;
      transition: linear 0.25s opacity;
      @media (max-width: $screen-phone) {
        position: initial;
        top: 0;
      }
      &__left,
      &__right {
        display: none;
        appearance: none;
        border-radius: 5rem;
        cursor: pointer;
        height: 3rem;
        width: 3rem;
        border: 0px none;
        box-shadow: 0 0 0 0 rgba(0, 0, 0, 0);
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        z-index: 9;
        background-color: rgba(255, 255, 255, 0.9);
        background-position: center center;
        background-repeat: no-repeat;
        background-size: 24px;
        line-height: 0;
        z-index: 8;
        transition: linear 0.15s all;
        margin-top: 0.8rem;
        &:hover {
          box-shadow: 1px 0 3px 0 rgba(0, 0, 0, 0.15);
        }
        &[disabled] {
          opacity: 0;
          display: none;
          top: -300vh;
        }
      }
      &__left {
        left: 0;
        background-image: url('/img/icons/arrow-left.svg');
      }
      &__right {
        right: 0;
        background-image: url('/img/icons/arrow-right.svg');
      }
    }

    &__cards {
      display: flex;
      transition: transform 750ms ease-in-out;
      transform: translatex(0);
    }

    &__sideMenu {
      float: right;
      position: relative;
      top: 0.3rem;
    }
  }
</style>
