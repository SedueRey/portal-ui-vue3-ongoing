<template>
  <div class="listItemSwitcher" v-if="isLogged">
    <span
      class="pose__button button__secondary btn-sm"
      tabindex="0"
      @click="showAll"
      @keyup.enter="showAll"
      @keyup.space="showAll"
      role="button"
    >
      Ver todos
    </span>
    <div class="listItemSwitcher__list" v-if="isLogged">
      <draggable
        v-model="draggableSliderList"
        class="mainmenu__draggable"
        ghost-class="ghost"
        @start="dragging = true"
        @end="dragging = false"
        item-key="sliderKey"
      >
        <template #item="{ element }">
          <div @click="toggleVisibility(element.sliderKey)" class="listItemSwitcher__itemContainer">
            <div class="listItemSwitcher__item" v-show="shouldShow(element)">
              <i class="fal fa-bars can-move" />
              <span class="listItemSwitcher__viewIcon" />
              <span class="listItemSwitcher__label">
                {{ $t(`${element.sliderKey}.title`) }}
              </span>
              <switcher
                :switch-estate="element.visible"
                @changeSwitcher="toggleVisibility(element.sliderKey)"
              />
            </div>
          </div>
        </template>
      </draggable>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed, onMounted, ref, watch } from 'vue';
  import draggable from 'vuedraggable';
  import { storeToRefs } from 'pinia';
  import Switcher from '@/app/shared/components/fwjsSwitcher.vue';
  import { useAuthStore } from '@/app/auth/store/auth';
  import { useServicesStore } from '../store/services';

  const dragging = ref(false);
  const { isLogged } = storeToRefs(useAuthStore());
  const { areas } = storeToRefs(useServicesStore());

  const orderedSliders = computed(() => {
    return Object.values(areas.value).sort((a, b) => a.order - b.order);
  });

  const draggableSliderList = ref(orderedSliders.value);

  const toggleVisibility = (key: string) => {
    useServicesStore().toggleVisibility(key);
  };

  const shouldShow = (slider) => {
    // POSE-859 - Desactivamos los carriles por rol hasta que se definan.
    return !!slider;
  };

  const showAll = () => {
    useServicesStore().showSliders();
  };

  onMounted(() => {
    useServicesStore().getSlidersInfo();
  });

  watch(dragging, (newVal) => {
    if (newVal === false) {
      useServicesStore().reorderSliders(draggableSliderList.value);
    }
  });
</script>
