<template>
  <section class="privatePage is-detail">
    <header class="header-form">
      <h1 class="privatePage__title">{{ $t('ggddappname') }}.</h1>
      <label :for="inputName" class="privatePage__label"> {{ $t('labeltitle') }} : </label>
      <InputText v-model="search" :placeholder="$t('placeholder')" />
      <Button @click="searchSyllabus()" class="mt-2" size="small" :label="$t('searchbutton')" />
    </header>
    <div v-if="!isSingle">
      <article v-if="search && search.length > 3 && !guide">
        <syllabus-list :search="search" />
      </article>
    </div>
    <div v-else>
      <syllabus-container v-if="id !== ''" :id="id" :type="type" />
    </div>
  </section>
</template>

<script lang="ts" setup>
  import { onBeforeMount, onMounted, ref, watch } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  import Button from 'primevue/button';
  import InputText from 'primevue/inputtext';
  import SyllabusContainer from '../components/SyllabusContainer.vue';
  import SyllabusList from '../components/SyllabusList.vue';
  import { useI18n } from 'vue-i18n';
  import { usePageStore } from '@/app/shared/store/pages';

  const route = useRoute();
  const router = useRouter();
  const { t } = useI18n();

  const guide = ref(null);
  const id = ref('');
  const inputName = ref('');
  const isSingle = ref(false);
  const search = ref('');
  const type = ref('');
  const url = ref('');

  onBeforeMount(() => {
    inputName.value = (Math.random() + 1).toString(36).substring(5);
  });

  onMounted(() => {
    usePageStore().setTitle(t('ggddappname'));
    if (route) {
      isSingle.value = !!route.params.type;
      if (!isSingle.value && route.params.search) {
        search.value =
          typeof route.params.search === 'string'
            ? route.params.search
            : route.params.search.join('');
      } else {
        id.value = typeof route.params.id === 'string' ? route.params.id : '';
        type.value = typeof route.params.type === 'string' ? route.params.type : '';
      }
    }
  });

  const searchSyllabus = () => {
    if (search.value.length > 3) {
      router.push(`/historico/guiadocente/search/${search.value}/`);
    }
  };

  watch(
    () => route.params,
    (params, old) => {
      url.value = JSON.stringify(params);
      isSingle.value = !!params.type;
      if (!isSingle.value && old.search !== params.search) {
        search.value = typeof params.search === 'string' ? params.search : '';
      } else {
        id.value = typeof params.id === 'string' ? params.id : '';
        type.value = typeof params.type === 'string' ? params.type : '';
      }
    },
  );
</script>

<style lang="scss">
  .privatePage {
    &__container {
      @media (min-width: $screen-sm-min) {
        margin-left: var(--private-menu-size);
      }
      @media (max-width: $screen-sm-min) {
        padding-top: 4rem;
      }
    }

    &__title {
      color: var(--main-text-color);
      font-size: 1.875rem;

      @media (max-width: $screen-sm-min) {
        font-size: 1.5rem;
      }
    }

    &__subtitle {
      line-height: 1.5;
      margin-top: -1.5rem;
    }

    input {
      width: 100%;
    }
  }
</style>
