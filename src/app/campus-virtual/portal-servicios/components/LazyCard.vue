<template>
  <article
    class="card"
    :class="getClass"
    itemscope
    itemtype="http://schema.org/Service"
    v-if="service"
    ref="cardtag"
  >
    <a
      v-if="isLoadedLazyService"
      :href="url"
      :target="placeToOpenLink"
      @click="beacon"
      @click.middle="beacon"
      @click.right="beacon"
      @keyup.enter="beacon"
      @keyup.space="beacon"
      class="card__buttonVisit"
    >
      <span class="card__notifications" v-if="unread">
        {{ unread }}
      </span>
      <img
        v-if="isNew && !isNewUser"
        class="card__newicon"
        :src="`/img/icons/${small ? 'new-pixelated-icon-colored' : 'new-icon'}.svg`"
        :alt="$t('new')"
        :title="$t('new')"
      />
      <span class="card__logo">
        <span class="card__iniciales" :class="inicialesClass">
          <span class="card__iniciales_circle">
            <icon-service class="card__icon" v-if="lazyService.logo" :logo="lazyService.logo" />
          </span>
        </span>
        <header class="card__header" v-if="isLoadedLazyService">
          <h1 :title="lazyService.name" class="card__namecontainer" itemprop="name">
            <span class="card__name">
              {{ lazyService.name }}
            </span>
          </h1>
        </header>
      </span>
    </a>
    <aside class="card__buttons">
      <button-starred
        v-if="isLoadedLazyService && showFavourite"
        class="card__buttonStarred"
        :service-id="service.identifier"
        :service-name="lazyService.name"
        tabindex="0"
      />
      <router-link
        v-if="!small && isLoadedLazyService && showInfo"
        class="card__link card__linkInfo"
        itemprop="url"
        :to="{ name: 'detail', params: { identifier: lazyService.identifier } }"
        :title="lazyService.name"
      >
        <img :alt="fillTitleInfo" :title="fillTitleInfo" src="/img/icons/info.svg" />
      </router-link>
    </aside>
  </article>
</template>

<script setup lang="ts">
  import { computed, nextTick, onMounted, type Ref, ref } from 'vue';
  import ButtonStarred from './ButtonStarred.vue';
  import type { CardItem } from '../portal-servicios.types';
  import IconService from './IconService.vue';
  import { storeToRefs } from 'pinia';
  import { useBeacon } from '@/app/shared/composables/useBeacon';
  import { useI18n } from 'vue-i18n';
  import { useNotificationsStore } from '@/app/shared/store/notifications';
  import useServiceComposable from '../composables/UseServiceComposable';
  import { useServicesStore } from '../store/services';
  import { useUserStore } from '@/app/user/store/user';

  const props = defineProps({
    service: { type: Object, required: true },
    showDescription: { type: Boolean, default: true },
    small: { type: Boolean, default: false },
    showFavourite: { type: Boolean, default: true },
    showInfo: { type: Boolean, default: true },
    shouldLoad: { type: Boolean, default: true },
  });

  let observer: IntersectionObserver | null = null;
  const { t } = useI18n();
  const beacon = useBeacon().beacon;
  const { cards } = storeToRefs(useServicesStore());
  const { notifications } = storeToRefs(useNotificationsStore());
  const { isNewUser } = storeToRefs(useUserStore());

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const lazyService = ref<any | null>(null);
  const isLoadedLazyService: Ref<boolean> = computed(
    () => lazyService.value !== null && !!lazyService.value?.name,
  );

  const isNew = computed(() => lazyService.value?.novelty === '1' || false);
  const isNewCardClass = computed(() => (isNew.value ? ' is_new' : ''));
  const getClass = computed(() => {
    let cardCategory = '';
    if (!lazyService.value) {
      return cardCategory;
    }
    try {
      cardCategory = `card__category_${lazyService.value.category[0].identifier}`;
    } catch (_e) {
      cardCategory = 'card__category_0';
    }
    return (
      cardCategory + (props.small ? ` is_small ${isNewCardClass.value}` : isNewCardClass.value)
    );
  });
  const inicialesClass = computed(() => {
    if (!lazyService.value) {
      return '';
    }
    try {
      return `card__iniciales__category_${lazyService.value?.category[0]?.identifier}`;
    } catch (_e) {
      return 'card__iniciales__category_0';
    }
  });

  const url = computed(() => useServiceComposable().externalUrl.value);
  const unread = computed(() => {
    return lazyService.value
      ? notifications.value.length > 0
        ? notifications.value.filter(
            (el) =>
              el.estado === 'NL' &&
              (`${el.codigo_aplicacion}` === lazyService.value.identifier ||
                el.aplicacion
                  .normalize('NFD')
                  .replace(/\p{Diacritic}/gu, '')
                  .replace(/ /g, '-')
                  .toLowerCase() ===
                  lazyService.value.name
                    .normalize('NFD')
                    .replace(/\p{Diacritic}/gu, '')
                    .replace(/ /g, '-')
                    .toLowerCase()),
          ).length
        : 0
      : 0;
  });
  const fillTitleInfo = computed(() => `${t('detail')} ${lazyService.value?.name || ''}`);
  const placeToOpenLink = computed(() => {
    const isInternal = useServiceComposable().externalUrl.value.startsWith('/#/');
    return isInternal || (lazyService.value.adapted && lazyService.value.adapted === '1')
      ? '_self'
      : '_blank';
  });

  const cardtag = ref(null);
  const startObserving = async (target = cardtag) => {
    await nextTick();
    if (observer && target.value) {
      observer.observe(target.value);
    }
  };
  const stopObserving = () => (!!observer ? observer.disconnect() : null);

  onMounted(async () => {
    useServiceComposable().lazyService.value = props.service as CardItem;
    useServiceComposable().service.value = props.service as CardItem;
    observer = new IntersectionObserver((entries) => {
      entries.forEach(async (entry) => {
        if (entry.isIntersecting) {
          await useServicesStore().loadCard(props.service.identifier);
          lazyService.value = cards.value.find((el) => el.identifier === props.service.identifier);
          if (!!lazyService.value.name) {
            return stopObserving();
          }
          useServiceComposable().lazyService.value = lazyService.value;
        }
      });
    });
    startObserving();
  });
</script>

<style lang="scss" scoped>
  @import '@/app/shared/assets/_categoryDesign.scss';

  .card {
    --logo-height: 80px;
    --colorCard-height: 128px;
    --font-size: 1rem;
    --iniciales-size: 3rem;
    --iniciales-padding: 1rem 0;
    --iniciales-font-size: 1rem;
    --padding-circle: 1.1rem 0 0 0;
    --description-color: #555;

    @media (max-width: $screen-sm-min) {
      --colorCard-height: 96px;
      --logo-height: 64px;
      --padding-circle: 0.8rem 0 0 0;
    }

    background-color: var(--card-bg-color);
    border-radius: var(--card-border-radius);
    box-shadow: var(--shadowLevel-2);
    box-sizing: border-box;
    flex-grow: 1;
    flex-shrink: 0;
    font-size: var(--font-size);
    height: var(--carousel-height);
    margin: 0 0.4rem 1rem 0.4rem;
    opacity: 1;
    overflow: hidden;
    position: relative;
    text-align: left;
    transition: box-shadow linear 0.15s;
    width: var(--carousel-item-width);
    z-index: 3;
    order: 99;

    &__iniciales__category_ {
      @for $i from 0 through 5 {
        &#{$i} {
          background: linear-gradient(
            135deg,
            var(--category#{$i}-color-light),
            var(--category#{$i}-color-medium) 50%,
            var(--category#{$i}-color) 100%
          );
          .card__icon {
            color: var(--category#{$i}-color);
          }
        }
      }
    }
    &:focus {
      outline: #007bff;
    }
    &:hover {
      .card__buttonStarred {
        display: block;
      }
      .card__buttonAdmin {
        display: block;
      }
      .card__link {
        display: block;
      }
      @for $i from 0 through 5 {
        .card__iniciales__category_#{$i} {
          background: linear-gradient(
            135deg,
            var(--category#{$i}-color-dark-light),
            var(--category#{$i}-color-dark-medium) 50%,
            var(--category#{$i}-color-dark) 100%
          );
          .card__icon {
            color: var(--category#{$i}-color-dark);
          }
        }
      }
    }

    &__is_empty {
      opacity: 0.05;
    }

    &__buttonVisit {
      color: var(--main-text-color);
      display: block;
      text-decoration: none;
    }

    &__iniciales {
      display: block;
      height: var(--colorCard-height);
      position: relative;
    }

    &__icon {
      font-size: 2.7rem;
      @media (max-width: $screen-sm-min) {
        font-size: 2.25rem;
        position: relative;
        top: 0.25rem;
      }
    }

    &__iniciales_circle {
      background-color: var(--main-bg-color);
      border-radius: 100%;
      box-shadow: var(--shadowLevel-2);
      box-sizing: border-box;
      height: var(--logo-height);
      left: 50%;
      padding: var(--padding-circle);
      position: absolute;
      top: 50%;
      transform: translate(-50%, -50%);
      width: var(--logo-height);
      text-align: center;
    }

    &__namecontainer {
      color: var(--description-color);
      font-weight: 500;
      font-size: 1rem;
      line-height: 1.5;
      margin: 0 0 0 0;
      padding: 1rem 0.8rem 0 1rem;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
      line-clamp: 2;
      overflow: hidden;
      @media (max-width: $screen-sm-min) {
        font-size: 0.875rem;
      }
    }

    &__name {
      display: block;
    }

    &__logo {
      &:hover {
        .card__name {
          text-decoration: underline;
        }
      }
    }

    &__buttons {
      align-items: center;
      position: absolute;
      bottom: 1.1rem;
      left: 1rem;
      right: 0;
      display: flex;
      flex-direction: row;
      > * {
        height: 1rem;
        @media (max-width: $screen-sm-min) {
          margin: 0 2rem 0 0;
          padding: 0.25rem 0.5rem 0.25rem 0.25rem;
        }
      }
    }

    &__buttonStarred {
      margin: 0 1rem 0 0;
    }

    &__linkInfo {
      display: block;
      margin: 0.2rem 1rem 0 0;
      opacity: 1;
      transition: opacity 0.25s linear;
      &:hover {
        opacity: 0.5;
      }
    }

    &__link {
      cursor: pointer;
      img {
        height: 1.4rem;
      }
    }

    &__notifications {
      background: #fff;
      border-radius: 100%;
      box-sizing: border-box;
      font-size: 0.8rem;
      height: 1.75rem;
      line-height: 1;
      padding: 0.5rem 0 0 0;
      position: absolute;
      right: 0.5rem;
      text-align: center;
      top: 0.5rem;
      width: 1.75rem;
      z-index: 1;
    }

    .buttonVisit__link {
      min-height: 13.5rem;
    }

    &__newicon {
      position: absolute;
      z-index: 1;
      height: 3rem;
      filter: invert(1);
      top: -0.3rem;
      left: 0.4rem;
    }

    &.is_small {
      height: var(--carousel-small-height);
      max-width: var(--carousel-item-small-width);
      width: var(--carousel-item-small-width);
      display: flex;
      flex-direction: row;
      @media (max-width: $screen-sm-min) {
        width: 100%;
      }
      .card__newicon {
        position: absolute;
        height: 1.5rem;
        top: unset;
        left: unset;
        bottom: 0rem;
        right: 0.4rem;
        opacity: 0.8;
      }
      .card__buttonVisit,
      .buttonVisit.card__buttonVisit {
        width: var(--carousel-item-small-width);
        &:focus {
          border: 2px solid #a0a0a0;
        }
      }
      .card__namecontainer {
        font-size: 0.85rem;
      }
      .card__buttonStarred {
        background: rgba(255, 255, 255, 0.8);
        display: none;
        height: 100%;
        padding: 1.4rem 1rem;
      }
      .card__buttonAdmin {
        display: none;
      }
      .card__icon {
        @media (max-width: $screen-sm-min) {
          top: 0rem;
        }
      }
      .card__link {
        display: none;
      }
      &:hover {
        .card__buttonStarred {
          display: block;
        }
      }
      .card__notifications {
        right: auto;
        left: 2.5rem;
        top: -0.05rem;
        transform: scale(0.6);
      }
      .card__buttons {
        right: 0;
        left: auto;
        top: 0;
        bottom: auto;
        .card__buttonStarred {
          margin: 0 0 0 0;
        }
      }
      .card__logo {
        align-items: center;
        display: flex;
        flex-direction: row;
        flex-wrap: nowrap;
        height: 4rem;
        .card__iniciales {
          width: 4rem;
          height: 6rem;
          flex-basis: auto;
          flex-grow: 0;
          min-width: 4rem;
          min-height: 6rem;
        }
        .card__iniciales_circle {
          height: 2.5rem;
          padding: 0.6rem 0 0 0;
          width: 2.5rem;
        }
        .card__icon {
          font-size: 1.25rem;
        }
        .card__namecontainer {
          font-weight: 500;
          padding: 0 0.875rem 0 1rem;
        }
      }
    }
  }

  .card.is_small.card__category_1 .card__newicon {
    filter: invert(0);
  }
  .card.is_small.card__category_2 .card__newicon {
    filter: invert(0) hue-rotate(269deg) brightness(1.3);
  }
  .card.is_small.card__category_3 .card__newicon {
    filter: invert(0) hue-rotate(180deg);
  }
  .card.is_small.card__category_4 .card__newicon {
    filter: invert(0) hue-rotate(220deg);
  }
  .card.is_small.card__category_5 .card__newicon {
    filter: invert(0) hue-rotate(38deg) brightness(3);
  }
</style>
