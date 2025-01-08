<template>
  <article v-if="props.search && props.search.length > 3 && !loading" class="syllabusList">
    <div v-if="syllabusList && syllabusList.length > 0">
      <ul class="syllabusList__list">
        <li v-for="(item, i) in syllabusList" :key="i">
          <ul v-if="item.titulaciones" class="syllabusList__titulaciones">
            <li v-for="(titulacion, j) in item.titulaciones" :key="j">
              <span>{{ titulacion.codTitu }} - </span>
              <span>{{ titulacion.descTitu }}, </span>
              <span>{{ titulacion.plan }}</span>
            </li>
          </ul>
          <syllabus-item :id="item.codAsig" :type="item.tipoAsig" :name="item.desAsi" />
        </li>
      </ul>
    </div>
  </article>
</template>

<script lang="ts" setup>
  import { onMounted, type Ref, ref, watch } from 'vue';
  import type { HistoricoGuiasSearchSyllabusResponse } from '../api/historico-guias.contracts';
  import syllabusApi from '../api/historico-guias.api';
  import SyllabusItem from './SyllabusItem.vue';

  // Props
  const props = defineProps<{
    search: string;
  }>();

  // Data convertido a Ref
  const loading: Ref<boolean> = ref(false);
  const syllabusList: Ref<HistoricoGuiasSearchSyllabusResponse[]> = ref([]);

  // computed
  // No hay

  // Métodos
  const searchSyllabus = (search) => {
    loading.value = true;
    syllabusApi
      .searchSyllabus(search)
      .then((response) => response.data)
      .then((data) => {
        loading.value = false;
        syllabusList.value = data; // syllabus;
      });
  };

  onMounted(() => {
    if (props.search !== '') {
      searchSyllabus(props.search);
    }
  });

  watch(props, (newVal) => {
    searchSyllabus(newVal);
  });
</script>

<style lang="scss">
  .syllabusList {
    margin: 1rem 0;
    &__list {
      list-style: none;
      margin: 0;
      padding: 0;
      li {
        margin: 0;
        padding: 0;
      }
    }
    &__titulaciones {
      border-bottom: 1px solid #f4f4f4;
      font-size: 0.75rem;
      list-style: none;
      margin: 0.5rem 0;
      padding: 0;
      li {
        margin: 0;
        padding: 0 0 0.75rem 0;
      }
    }
  }
</style>
