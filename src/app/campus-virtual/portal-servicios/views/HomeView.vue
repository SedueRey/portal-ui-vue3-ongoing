<template>
  <div class="home" v-if="isLogged">
    <Hero />
    <div rel="Dashboard" v-if="false" />
    <div rel="my-events-container" />
    <div v-if="!areasToShow && showMessage" class="completeList__info">
      <div class="alert alert__warning">
        {{ $t('noVisibleSliderMsg') }}
        {{ $t('noVisibleSliderMsg2') }}
        {{ $t('noVisibleSliderMsg3') }}
        <router-link to="/preferences">
          {{ $t('noVisibleSliderBtn') }}
        </router-link>
      </div>
    </div>
    <div class="completeList__container" v-if="!loadingSliders && userIsLoaded">
      <span id="carriles" />
      <draggable
        v-model="draggableSliderList"
        class="mainmenu__draggable completeList__sliders"
        ghost-class="ghost"
        @start="dragging = true"
        @end="dragging = false"
        v-if="isLogged && !isMobileData"
        :component-data="{ name: 'fade' }"
        item-key="sliderKey"
      >
        <template #item="{ element }">
          <slider-component
            :p-slider-key="element.sliderKey"
            :p-order="element.order"
            :p-visible="element.visible"
            :p-private="element.private"
            :p-tidy="element.tidy"
            :p-services="element.services"
            :p-param="element.param"
            :p-view-type="element.viewType"
            :style="'order:' + element.order + ';'"
            :p-options="element.orderParams"
            :p-small-cards="element.smallCards || null"
            :p-roles="element.roleName"
          />
        </template>
      </draggable>
      <div v-else>
        <slider-component
          v-for="area in orderedSliders"
          :key="area.sliderKey"
          :p-slider-key="area.sliderKey"
          :p-order="area.order"
          :p-visible="area.visible"
          :p-private="area.private"
          :p-tidy="area.tidy"
          :p-services="area.services"
          :p-param="area.param"
          :p-view-type="area.viewType"
          :style="'order:' + area.order + ';'"
          :p-options="area.orderParams"
          :p-small-cards="area.smallCards"
          :p-roles="area.roleName"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed, onMounted, onUnmounted, ref, type Ref } from 'vue';
  import draggable from 'vuedraggable';
  import Hero from '../components/HeroHome.vue';
  import type { Slider } from '../portal-servicios.types';
  import SliderComponent from '../components/SliderComponent.vue';
  import { storeToRefs } from 'pinia';
  import { useAuthStore } from '@/app/auth/store/auth';
  import { usePageStore } from '@/app/shared/store/pages';
  import { useServicesStore } from '../store/services';
  import { useUserStore } from '@/app/user/store/user';

  /*
  import Dashboard from '@/app/campus-virtual/dashboard/components/Dashboard.vue';
  import MyEventsContainer from '../components/MyEventsContainer.vue';
  */

  const dragging: Ref<boolean> = ref(true);
  const showMessage = ref(false);
  const isMobileData = ref(true);

  const { areas, loadingSliders } = storeToRefs(useServicesStore());
  const { isLogged } = storeToRefs(useAuthStore());
  const { userIsLoaded } = storeToRefs(useUserStore());

  const areasToShow = computed(() => {
    return (
      Object.values(areas.value).filter(
        (el) => el.visible === true /* && el.services.length > 0 && el.loaded === true */,
      ).length > 0
    );
  });

  const orderedSliders = computed(() => {
    return Object.values(areas.value).sort((a, b) => a.order - b.order);
  });

  const draggableSliderList = computed({
    get() {
      return orderedSliders.value;
    },
    set(value) {
      const newValueOrder: Slider[] = [];
      for (let i = 0; i < value.length; i += 1) {
        newValueOrder.push({ ...value[i], order: i });
      }
      useServicesStore().reorderSliders(newValueOrder);
    },
  });

  const computedStyle = () => {
    return parseInt(
      window
        .getComputedStyle(document.body)
        .getPropertyValue('--mobile-menu-size')
        .replace('px', ''),
      10,
    );
  };

  const isTouchable = () => {
    const isTouchable = window.matchMedia && window.matchMedia('(any-pointer:coarse)').matches;
    return window.outerWidth < computedStyle() || isTouchable;
  };

  const changeResizable = () => {
    isMobileData.value = isTouchable();
  };

  onMounted(() => {
    if (isLogged.value === true) {
      useServicesStore().getSlidersInfo();
    }
    usePageStore().setTitle('');
    setTimeout(() => {
      showMessage.value = true;
    }, 1500);
    isMobileData.value = isTouchable();
    window.addEventListener('resize', changeResizable);
  });

  onUnmounted(() => {
    window.removeEventListener('resize', changeResizable);
  });
</script>

<style lang="scss" scoped>
  .completeList {
    &__container {
      display: flex;
      flex-direction: column;
      list-style: none;
    }
    &__sliders {
      list-style: none;
      padding: 0 0 0 0;
      margin: 2rem 0 0 0;
      display: flex;
      min-height: 100vh;
      flex-direction: column;
      > li:first-child {
        padding-top: 1rem;
      }
    }
    &__info {
      max-width: var(--grid-width);
      margin: 1rem auto;
    }
  }
  .ghost {
    opacity: 0.5;
    border: 2px dashed var(--main-color);
    box-shadow: inset 0 0 2rem 0 rgba(0, 0, 0, 0.25);
  }
</style>
