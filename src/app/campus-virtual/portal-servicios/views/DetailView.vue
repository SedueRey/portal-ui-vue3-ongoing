<template>
  <section
    v-if="service && service.identifier"
    class="detail"
    :class="getClass"
    itemscope
    itemtype="http://schema.org/Service"
    tabindex="-1"
  >
    <div class="detail__inner" tabindex="-1">
      <header class="detail__header is__card" tabindex="-1">
        <span class="detail__logo" tabindex="-1">
          <a
            class="detail__iniciales"
            :aria-label="service.name"
            :href="externalUrl"
            @click="beacon"
            @click.middle="beacon"
            @click.right="beacon"
            @keyup.enter="beacon"
            @keyup.space="beacon"
            :class="inicialesClass"
          >
            <div class="detail__inicialesCircle">
              <icon-service class="card__icon" v-if="service.logo" :logo="service.logo" />
            </div>
          </a>
          <span class="detail__headertext">
            <h1 :title="service.name" class="detail__name" itemprop="name">
              {{ service.name }}
            </h1>
            <a
              :href="externalUrl"
              @click="beacon"
              @click.middle="beacon"
              @click.right="beacon"
              @keyup.enter="beacon"
              @keyup.space="beacon"
              class="detail__outsideButton"
            >
              {{ $t('access') }}
            </a>
            <nav v-if="isLogged && service && service.name" class="detail__headerNav">
              <ButtonStarred
                class="detail__buttonStarred"
                :service-id="service.identifier"
                :service-name="service.name"
              />
            </nav>
          </span>
        </span>
      </header>
      <div
        v-if="service.disambiguatingDescription"
        class="detail__disambiguatingDescription"
        itemprop="disambiguatingDescription"
        v-html="service.disambiguatingDescription"
      />
      <CollapsableElement
        v-if="service.description"
        class="is__card is__singleCard"
        :title="$t('longDesc')"
        :collapsed="false"
      >
        <div
          v-if="service.description"
          class="detail__description"
          itemprop="description"
          v-html="cleanedHTML"
        />
      </CollapsableElement>
      <CollapsableElement
        class="is__card is__singleCard"
        :title="$t('potentialAction')"
        :collapsed="false"
        v-if="service.potentialAction"
      >
        <div
          v-if="service.potentialAction"
          class="detail__description"
          itemprop="description"
          v-html="cleanedPotentialAction"
        />
      </CollapsableElement>
      <CollapsableElement
        class="is__card is__singleCard"
        :title="$t('childrenServices') + ' ' + service.name"
        v-if="relatedServices && relatedServices.length > 0"
      >
        <ul v-if="relatedServices" class="detail__children">
          <li v-for="item in relatedServices" :key="item.identifier" class="detail__childrenItem">
            <LazyCard v-if="item && item.name" :small="true" :service="item" />
          </li>
        </ul>
      </CollapsableElement>
      <aside class="detail__metadata">
        <CollapsableElement
          class="is__card is__singleCard"
          :collapsed="true"
          :title="`${$t('notifications')} (${unread.length})`"
          v-if="unread.length > 0"
        >
          <ul class="detail__notifications">
            <li
              class="detail__notificationsMenuItem"
              v-for="item in unread"
              :key="item.codigo_alerta"
            >
              <h4 class="detail__notificationsMenuTitle">
                {{ item.titulo }}
              </h4>
              <time class="detail__notificationsMenuTime" :datetime="item.fecha_creacion">
                {{ item.fecha_creacion }}
              </time>
              {{ item.descripcion }}
            </li>
          </ul>
        </CollapsableElement>
      </aside>
    </div>
  </section>
</template>

<script setup lang="ts">
  import { computed, onMounted, type Ref, ref } from 'vue';
  import ButtonStarred from '../components/ButtonStarred.vue';
  import type { CardItem } from '../portal-servicios.types';
  import CollapsableElement from '../components/CollapsableElement.vue';
  import IconService from '../components/IconService.vue';
  import LazyCard from '../components/LazyCard.vue';
  import type { Notificacion } from '@/app/shared/shared.types';
  import servicesApi from '../api//services.api';
  import { storeToRefs } from 'pinia';
  import { useAuthStore } from '@/app/auth/store/auth';
  import { useBeacon } from '@/app/shared/composables/useBeacon';
  import { useNotificationsStore } from '@/app/shared/store/notifications';
  import { usePageStore } from '@/app/shared/store/pages';
  import useServiceComposable from '../composables/UseServiceComposable';
  import { useServicesStore } from '../store/services';

  const props = defineProps<{
    identifier: string;
  }>();

  const { beacon } = useBeacon();

  const relatedServices: Ref<CardItem[]> = ref([]);

  const { lazyService, cleanedHTML, cleanedPotentialAction, externalUrl, getClass } =
    useServiceComposable();
  const { cards, service } = storeToRefs(useServicesStore());
  const { notifications } = storeToRefs(useNotificationsStore());

  const { isLogged } = storeToRefs(useAuthStore());

  const unread: Ref<Notificacion[]> = computed(() => {
    if (!service.value?.name) return [];
    return notifications.value.length > 0
      ? notifications.value.filter(
          (el) =>
            el.estado === 'NL' &&
            el.aplicacion
              .normalize('NFD')
              .replace(/\p{Diacritic}/gu, '')
              .replace(/ /g, '-')
              .toLowerCase() ===
              service.value?.name
                .normalize('NFD')
                .replace(/\p{Diacritic}/gu, '')
                .replace(/ /g, '-')
                .toLowerCase(),
        )
      : [];
  });

  const inicialesClass = computed(() => {
    const category = service.value?.category[0]?.identifier || '0';
    return `detail__iniciales__category_${category}`;
  });

  onMounted(() => {
    window.scrollTo(0, 0);
    useServicesStore().loadDetail(props.identifier);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    lazyService.value = cards.value.find((el) => el.identifier === props.identifier) as any;
    try {
      usePageStore().setTitle(lazyService.value?.name || '');
    } catch (_error) {}
    servicesApi.getRelatedServices(props.identifier).then((response) => {
      relatedServices.value = response.data;
    });
  });
</script>

<style lang="scss">
  @import '@/app/shared/assets/_categoryDesign.scss';

  .detail {
    padding: 4rem 1rem 1rem 1rem;
    @media (max-width: $screen-sm-min) {
      padding: 0;
    }
    &__inner {
      background-color: #fff;
      max-width: var(--detail-grid-width);
      border-radius: 6px;
      border: solid 1px #ebeff1;
      box-shadow: var(--shadowLevel-2);
      margin: 0 auto;
      @media (max-width: $screen-sm-min) {
        border: 0px none;
        margin: 1rem auto;
        box-shadow: none;
      }
    }
    &__logo {
      align-items: center;
      display: flex;
      flex-direction: row;
      @media (max-width: $screen-sm-min) {
        flex-direction: column;
      }
    }
    &__buttonStarred {
      line-height: 1;
      width: 2.5rem;
      height: 2.5rem;
    }
    &__outsideButton {
      background-color: #ebeff1;
      color: #666;
      border-radius: 2rem;
      display: block;
      font-size: 0.875rem;
      overflow: hidden;
      width: 8rem;
      text-decoration: none;
      line-height: 0;
      font-size: 1rem;
      text-align: center;
      padding: 1.3rem 0;
      @media (max-width: $screen-sm-min) {
        margin: 0.5rem auto;
        padding: 1.3rem 0.5rem;
      }
      &:hover {
        font-weight: 500;
      }
    }
    &__name {
      color: #555555;
      font-size: 1.5rem;
      font-weight: 600;
      line-height: 1.1;
      line-height: 1.05;
      padding: 0 0 0 0;
      margin: 0 0 1rem 0;
      @media (max-width: $screen-sm-min) {
        margin: 1.5rem 0;
        font-size: 1.35rem;
      }
    }
    &__subnav {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      padding: 1rem 3rem;
      @media (max-width: $screen-sm-min) {
        padding: 1.5rem;
      }
    }
    &__header {
      padding: 1.5rem 1.5rem;
      position: relative;
    }
    &__headerNav {
      right: 0.8rem;
      line-height: 0;
      padding: 0.75rem;
      position: absolute;
      top: 0.8rem;
      z-index: 1;
    }
    &__disambiguatingDescription {
      background-color: var(--card-bg-color);
      display: block;
      font-size: 1rem;
      line-height: 1.5;
      padding: 1rem 1.5rem;
    }
    &__iniciales {
      border-radius: 2rem;
      display: block;
      width: 6.7rem;
      height: 6.7rem;
      min-width: 6.7rem;
      min-height: 6.7rem;
      position: relative;
      box-shadow: var(--shadowLevel-1);
      &:hover {
        box-shadow: var(--shadowLevel-3);
      }
      &__category_ {
        @for $i from 0 through 5 {
          &#{$i} {
            background: linear-gradient(
              135deg,
              var(--category#{$i}-color-dark-light),
              var(--category#{$i}-color-dark-medium) 50%,
              var(--category#{$i}-color-dark) 100%
            );
            color: var(--category#{$i}-color);
          }
        }
      }
    }
    &__inicialesCircle {
      background-color: #fff;
      border-radius: 100%;
      box-shadow: var(--shadowLevel-2);
      box-sizing: border-box;
      font-size: 2.9rem;
      height: 5rem;
      left: 50%;
      padding: 0.5rem 0 0 0;
      position: absolute;
      text-align: center;
      top: 50%;
      transform: translate(-50%, -50%);
      width: 5rem;
      .card__icon {
        left: 50%;
        position: absolute;
        top: 50%;
        transform: translate(-50%, -50%);
      }
    }
    &__headertext {
      display: block;
      margin-left: 2rem;
      @media (max-width: $screen-sm-min) {
        margin-left: 0;
        text-align: center;
      }
    }
    &__categoryChildren {
      background: inherit;
      border-radius: 100%;
      border: 1px solid #fff;
      bottom: 0;
      box-sizing: border-box;
      display: block;
      font-size: 1.1rem;
      font-weight: 400;
      height: 20px;
      line-height: 1;
      overflow: hidden;
      padding: 0px 0 0 0;
      position: absolute;
      right: 0;
      text-align: center;
      width: 20px;
    }
    &__children {
      list-style: none;
      padding: 0 0;
      margin: 0 0 0 0;
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;
      justify-content: flex-start;
    }
    &__childrenItem {
      @media (max-width: $screen-sm-min) {
        width: 100%;
      }
    }
    &__childrenTitle {
      font-size: 1.25rem;
      font-weight: 500;
      margin: 0 0 1rem 0;
      padding: 0 0 0 0;
    }
    &__description {
      font-size: 0.875rem;
      line-height: 1.5;
    }
    &__areasServed,
    &__rol {
      font-size: 0.875rem;
      display: inline-block;
      margin-right: 8px;
    }
    &__notifications {
      list-style: none;
      margin: 0 0 0 0;
      padding: 0 0 0 0;
    }
    &__notificationsMenuItem {
      font-size: 0.75rem;
      margin: 0 0 0.5rem 0;
      border-bottom: 1px solid var(--border-color);
      padding: 0.25rem 0 0.75rem 0;
    }
    &__notificationsMenuTitle {
      font-weight: 500;
      font-size: 0.875rem;
      margin: 0 0 0.5rem 0;
    }
    &__notificationsMenuTime {
      display: block;
      font-size: 0.7rem;
      margin: 0 0 0.25rem 0;
    }
    .collapsable {
      padding: 1rem 1.5rem;
      &__title {
        font-size: 1rem;
        font-weight: 600;
        margin: 0 0 1rem 0;
        padding: 0 0 0.5rem 0;
        border-bottom: 1px solid #c8cacc;
        position: relative;
        width: 100%;
      }
      &__icon {
        position: relative;
        top: -0.413rem;
      }
    }
  }
</style>
