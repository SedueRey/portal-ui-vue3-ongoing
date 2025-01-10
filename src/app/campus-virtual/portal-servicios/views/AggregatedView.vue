<template>
  <article class="cardgenerica aggregated" v-if="shouldShow">
    <h1 v-if="service">{{ service.name }}</h1>
    <div v-html="cleanedPotentialAction" />
    <CardGroupOpened
      v-if="orderedServices"
      :service-list="orderedServices"
      :show-description="false"
      :show-button="false"
      :small-cards="true"
      :show-favourite="false"
      :should-load="true"
    />
  </article>
</template>

<script setup lang="ts">
  import { computed, onMounted } from 'vue';
  import CardGroupOpened from '../components/CardGroupOpened.vue';
  import type { CardItem } from '../portal-servicios.types';
  import { storeToRefs } from 'pinia';
  import useServiceComposable from '../composables/UseServiceComposable';
  import { useServicesStore } from '../store/services';

  const props = defineProps<{
    route: string | string[];
    identifier?: string | string[];
  }>();

  const { service } = storeToRefs(useServicesStore());
  const { cleanedPotentialAction, lazyService } = useServiceComposable();

  const shouldShow = computed(() => {
    return service.value && service.value.name;
  });

  const orderedServices = computed(() => {
    if (!service.value?.sonsOfSuperCards) {
      return [];
    }
    const sonsOfSuperCards = JSON.parse(JSON.stringify(service.value.sonsOfSuperCards));
    sonsOfSuperCards.sort((a, b) => a.name.localeCompare(b.name));
    return sonsOfSuperCards;
  });

  onMounted(async () => {
    const identifier =
      typeof props.identifier === 'string' ? props.identifier : props.identifier?.join('');
    const routePath = typeof props.route === 'string' ? props.route : props.route.join('');
    if (!!identifier) {
      await useServicesStore().loadDetail(identifier);
      lazyService.value = service.value as unknown as CardItem;
    } else {
      if (routePath !== '') {
        await useServicesStore().loadDetailByURL(routePath);
        lazyService.value = service.value as unknown as CardItem;
      }
    }
  });
</script>

<i18n>
{
  "en": {
    "loading": "Loading..."
  },
  "es": {
    "loading": "Cargando..."
  }
}
</i18n>

<style lang="scss">
  .cardgenerica {
    max-width: var(--detail-grid-width);
    margin: 0 auto;
    padding: 0 1rem;

    h1 {
      color: var(--main-text-color);
      font-size: 1.875rem;
      @media (max-width: $screen-sm-min) {
        font-size: 1.5rem;
      }
    }

    &.aggregated {
      .card.is_new {
        order: 0;
      }
    }
  }
</style>
