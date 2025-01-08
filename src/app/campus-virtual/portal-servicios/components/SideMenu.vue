<template>
  <nav class="sideMenu">
    <span
      class="sideMenu__button is-clickable"
      v-if="showLess && canCarousel"
      @click="activate()"
      :title="$t('showless')"
    >
      <i class="fa-solid fa-down-left-and-up-right-to-center" />
      <span class="sr-only">{{ $t('showless') }}</span>
    </span>
    <span
      class="sideMenu__button is-clickable"
      v-if="showMore && canCarousel"
      :title="$t('showmore')"
      @click="deActivate()"
    >
      <i class="fas fa-expand-alt" />
      <span class="sr-only">{{ $t('showmore') }}</span>
    </span>
    <span class="sideMenu__button is-movable" v-if="!useMobile().isMobile()">
      <i class="fas fa-arrows-alt" />
    </span>
    <div class="sideMenu__option">
      <span class="sideMenu__toggler" @click="toggleCollapsable" />
      <ul v-click-outside="hide" class="sideMenu__menu" v-if="!collapsed">
        <li class="sideMenu__menuItem" @click="toggleVisibility()">
          <i class="far fa-eye" /> {{ $t('hide') }}
        </li>
        <li class="sideMenu__separator" />
        <li class="sideMenu__subtitle">
          {{ $t('order') }}
        </li>
        <span v-if="options && options.options.length && options.options.length > 0">
          <li
            v-for="option in options.options"
            :value="option.value"
            :key="option.key"
            :disabled="option.disabled === false ? null : option.disabled"
            class="sideMenu__menuItem"
            :class="sliderParam !== option.value ? '' : 'is-active'"
            @click="reorderSlider(option.value)"
          >
            {{ $t(option.i18n) }}
          </li>
        </span>
        <li class="sideMenu__separator" v-if="canCarousel" />
        <li class="sideMenu__subtitle" v-if="canCarousel">
          {{ $t('filter') }}
        </li>
        <li @click="filter('')" v-if="filterCat !== ''" class="sideMenu__menuItem">
          {{ $t('showall') }}
        </li>
        <span v-if="cats && canCarousel">
          <li
            v-for="c in cats"
            :key="c.color"
            @click="filter(c.id)"
            class="sideMenu__menuItem"
            :class="`${c.id}` !== filterCat ? '' : 'is-active'"
          >
            <span class="sideMenu__colorItem" :style="`background-color: ${c.color}`" />
            {{ c.name }}
          </li>
        </span>
      </ul>
    </div>
  </nav>
</template>

<script setup lang="ts">
  import { onMounted, ref } from 'vue';
  import categories from '../models/categories';
  import type { SliderConfig } from '../portal-servicios.types';
  import { storeToRefs } from 'pinia';
  import { useMobile } from '@/app/shared/composables/useMobile';
  import { useServicesStore } from '../store/services';
  import { useUserStore } from '@/app/user/store/user';

  const props = withDefaults(
    defineProps<{
      options?: SliderConfig | null;
      showMore?: boolean;
      showLess?: boolean;
      canCarousel?: boolean;
    }>(),
    {
      showMore: false,
      showLess: false,
      canCarousel: true,
      options: null,
    },
  );

  const emit = defineEmits(['carouselDeactivate', 'carouselActivate', 'carouselFilter']);

  const { user } = storeToRefs(useUserStore());

  const collapsed = ref(true);
  const sliderAction = ref('');
  const sliderKey = ref('');
  const sliderParam = ref('');
  const cats = ref(categories);
  const filterCat = ref('');

  const setCardList = (payload) => useServicesStore().setCardList(payload);

  const reorderSlider = (param) => {
    if (user.value !== null) {
      localStorage.setItem(btoa(user.value.email), JSON.stringify({ key: sliderKey.value, param }));
    }
    sliderParam.value = param;
    setCardList({
      type: sliderKey.value,
      param: sliderParam.value,
    });
    collapsed.value = true;
  };

  const toggleCollapsable = () => {
    collapsed.value = !collapsed.value;
  };

  const deActivate = () => {
    emit('carouselDeactivate');
  };

  const activate = () => {
    emit('carouselActivate');
  };

  const filter = (value) => {
    filterCat.value = value;
    emit('carouselFilter', value);
  };

  const hide = (event) => {
    if (!event.target.classList.contains('sideMenu__toggler')) {
      collapsed.value = true;
    }
  };

  const toggleVisibility = () => useServicesStore().toggleVisibility(sliderKey.value);

  onMounted(() => {
    if (props.options === null) {
      return;
    }
    sliderKey.value = props.options.sliderKey;
    let storedData = {
      key: '',
      param: '',
    };
    if (user.value !== null) {
      const storageData = localStorage.getItem(btoa(user.value.email));
      if (storageData) {
        storedData = JSON.parse(storageData);
      }
    }
    sliderParam.value =
      storedData.key === sliderKey.value && storedData.param !== ''
        ? storedData.param
        : props.options.sliderParam;
    sliderAction.value = props.options.sliderAction;
    const savedFiltered = window.sessionStorage.getItem(`ORDER_${sliderKey.value}`) || '';
    filter(savedFiltered);
  });
</script>

<i18n src="../locales/i18nSliders.json"></i18n>

<style lang="scss">
  .sideMenu {
    position: relative;
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    @media (max-width: $screen-sm-min) {
      top: 0.45rem;
    }
    &__button {
      cursor: pointer;
      display: block;
      width: 32px;
      height: 32px;
      text-align: center;
      line-height: 2;
      margin: 0 0 0 4px;
      opacity: 1;
      transition: opacity 0.25s linear;
      &:hover {
        opacity: 0.5;
      }
      &.is-movable {
        cursor: move;
        @media (max-width: $screen-lg-min) {
          display: none;
        }
      }
      &.is-clickable {
        cursor: pointer;
      }
    }
    &__toggler {
      background-image: url('/img/icons/dots.svg');
      cursor: pointer;
      display: inline-block;
      width: 32px;
      height: 32px;
      background-size: 16px 16px;
      background-repeat: no-repeat;
      background-position: center;
      border-radius: 4px;
      margin: 0 0 0 0;
      transition: opacity 0.25s linear;
      opacity: 1;
      &:hover {
        opacity: 0.5;
      }
    }
    &__menu {
      position: absolute;
      right: -0.5rem;
      top: 1.9rem;
      background: var(--main-bg-color);
      font-size: 0.9rem;
      z-index: 99;
      width: 18rem;
      margin: 0.3rem 0.5rem 0 -13.6rem;
      list-style: none;
      padding: 0 0 0 0;
      z-index: 101;
      max-height: var(--carousel-height);
      overflow: auto;
      box-shadow: var(--shadowLevel-2);
    }
    &__menuItem {
      cursor: pointer;
      padding: 0.9rem 1rem 0.9rem 1.2rem;
      &:hover {
        background-color: #f0f0f0;
      }
      &.is-active {
        background-color: #f5f5f5;
      }
      &.is-active:hover {
        background-color: #f0f0f0;
      }
      i {
        margin: 0 1rem 0 0rem;
      }
    }
    &__subtitle {
      display: block;
      font-size: 0.625rem;
      font-weight: 600;
      text-transform: uppercase;
      padding: 0.875rem 1rem 0.5rem 1.3rem;
    }
    &__separator {
      border-bottom: 1px solid #c0c0c0;
      margin: 8px 0 4px 0;
    }
    &__colorItem {
      border-radius: 3rem;
      display: inline-block;
      height: 1.2rem;
      vertical-align: middle;
      width: 1.2rem;
      position: relative;
      margin: 0 1rem 0 0;
    }
  }
</style>
