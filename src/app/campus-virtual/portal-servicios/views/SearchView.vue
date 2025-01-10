<template>
  <div class="completeList searchResults">
    <section class="cardGroupList__item">
      <h1 class="cardGroup__title">
        {{ $t('resultTitle') }}
      </h1>
      <p v-if="searching">
        {{ $t('searching') }}
      </p>
      <p v-else class="cardGroup__search">
        <HeaderSearch
          :has-bg="false"
          v-if="searchString"
          :input-data="searchString"
          class="search__inputSearch"
        />
      </p>
      <fwjs-message v-if="searchItems.length === 0 && !searching" :category="errorMsg.categoryMsg">
        {{ $t('emptyResult1') }} <strong>{{ fillErrorMsg }}</strong> {{ $t('emptyResult2') }}
      </fwjs-message>
      <div v-else-if="!searching">
        <span class="searchResults__message">
          {{ $t('foundResult1') }} {{ searchItems.length }} {{ $t('foundResult2') }}
        </span>
        {{ $t('searchingFor') }} <strong>{{ searchString }}</strong>
        <CardGroupOpened
          :service-list="searchItems"
          :show-description="false"
          :show-button="false"
        />
      </div>
      <SearchFeedback v-if="!searching" />
      <div v-if="!searching">
        <h1 class="cardGroup__title">
          {{ $t('resultTitleAlt') }}
        </h1>
        <span class="searchResults__message">
          {{ $t('searchingUM1') }}
          <strong>{{ searchString }}</strong>
          {{ $t('searchingUM2') }}
        </span>
        &nbsp;
        <a
          :href="`https://www.um.es/web/universidad/buscador?q=${urlBuscadorUMU}`"
          target="_blank"
          rel="noopener"
          >{{ $t('searchingUMLink') }}</a
        >
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
  import { computed, onMounted, type Ref, ref } from 'vue';
  import CardGroupOpened from '../components/CardGroupOpened.vue';
  import type { CardItem } from '../portal-servicios.types';
  import fwjsMessage from '@/app/shared/components/fwjsMessage.vue';
  import HeaderSearch from '../components/HeaderSearch.vue';
  import type { PortalServiciosServiceResponse } from '../api/portal-servicios.contracts';
  import SearchFeedback from '../components/SearchFeedback.vue';
  import servicesApi from '../api/services.api';
  import { storeToRefs } from 'pinia';
  import { useAuthStore } from '@/app/auth/store/auth';
  import { useI18n } from 'vue-i18n';
  import { usePageStore } from '@/app/shared/store/pages';
  import { useServicesStore } from '../store/services';

  const props = defineProps<{
    tag: string | string[];
  }>();

  const searchString: Ref<string | null> = ref('');
  const searchItems: Ref<CardItem[]> = ref([]);
  const searching = ref(false);
  const errorMsg = ref({ categoryMsg: 'info' });

  const { isLogged } = storeToRefs(useAuthStore());
  const { t } = useI18n();

  const fillErrorMsg = computed(() => searchString.value);
  const urlBuscadorUMU: Ref<string> = computed(() =>
    !!searchString.value ? encodeURI(searchString.value) : '',
  );

  onMounted(() => {
    searching.value = true;
    searchString.value = props.tag
      ? typeof props.tag === 'string'
        ? props.tag
        : props.tag.join('')
      : null;
    if (searchString.value) {
      usePageStore().setTitle(`${t('searchingForTitle')}: ${searchString.value}`);
      servicesApi
        .search({
          tag: searchString.value,
          logged: isLogged.value,
        })
        .then((r) => r.data)
        .then((searchData) => {
          searching.value = false;
          searchItems.value = searchData;
          const idSearchItems = searchItems.value.map((el) => ({
            identifier: el.identifier,
            searchId: el.searchId,
          }));
          useServicesStore().searchedItemsMutation(
            idSearchItems as PortalServiciosServiceResponse[],
          );
        })
        .catch(() => {
          searching.value = false;
          useServicesStore().searchedItemsMutation([]);
        });
    }
  });
</script>

<style lang="scss" scoped>
  .searchResults {
    min-height: 100vh;

    &__message {
      color: var(--dark-grey-300);
      font-size: 1rem;
    }
  }
  .completeList {
    max-width: var(--grid-width);
    margin: 1rem auto;
    padding: 2rem 1rem 0 1rem;
    &__container {
      display: flex;
      flex-direction: column;
      list-style: none;
    }
    &__sliders {
      list-style: none;
      padding: 0 0 0 0;
      margin: 0 0 0 0;
      display: flex;
      flex-direction: column;
    }
  }
  .search__inputSearch {
    border: 1px solid #d0d0d0 !important;
    border-radius: 3em;
    input {
      width: 100% !important;
      max-width: 100% !important;
    }
  }
  .cardGroup__title {
    border-bottom: 1px solid var(--border-color);
    font-family: var(--font-family);
    font-weight: 600;
    font-size: 1rem;
    margin: 1rem 0 2rem 0;
    padding: 0 0 0.5rem 0;
  }
  .cardGroupList__item {
    min-height: 100vh;
  }
  .openedCarousel {
    margin: 0 0 5rem 0;
  }
  .cardGroupList {
    list-style: none;
    margin: 0 0 0 0;
    padding: 0 0 0 0;
    position: relative;
    &__item {
      max-width: var(--grid-width);
      overflow: hidden;
    }
  }
</style>
