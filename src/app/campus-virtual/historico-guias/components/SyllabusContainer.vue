<template>
  <div class="syllabus" v-if="!emptyList">
    <ul v-if="titulaciones" class="syllabus__titulaciones">
      <li v-for="(titulacion, j) in titulaciones" :key="j">
        <span>{{ titulacion.codTitu }} - </span>
        <span>{{ titulacion.descTitu }}, </span>
        <span>{{ titulacion.plan }}</span>
      </li>
    </ul>
    <div v-if="list" class="syllabus__linklist">
      <span v-for="(guia, i) in list" :key="i" class="syllabus__item">
        <h1 class="syllabus__title" v-if="i === 0">({{ guia.codAsig }}) - {{ guia.desAsi }}</h1>
        <h2 class="syllabus__subtitle" v-if="i === 0">{{ $t('years') }}:</h2>
        <a
          class="syllabus__link"
          :download="`${guia.namePdf}.pdf`"
          :href="guia.urlPdf"
          target="_blank"
        >
          {{ guia.cursoAca }}, {{ guia.idioma }}
        </a>
        <br />
      </span>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { computed, onMounted, ref, type Ref } from 'vue';
  import type {
    HistoricoGuiasItemGuia,
    HistoricoGuiasTitulacionItem,
  } from '../api/historico-guias.contracts';
  import syllabusApi from '../api/historico-guias.api';

  const props = defineProps({
    type: { type: String, required: true },
    id: { type: String, required: true },
  });

  const list: Ref<HistoricoGuiasItemGuia[]> = ref([]);
  const titulaciones: Ref<HistoricoGuiasTitulacionItem[]> = ref([]);

  const emptyList = computed(() => list.value.length === 0);

  const selectSyllabus = () => {
    syllabusApi
      .select(props.type, props.id)
      .then((r) => r.data)
      .then((items) => {
        const { guias } = items;
        if (guias && guias.length > 0) {
          guias.sort((a, b) => a.cursoAca.localeCompare(b.cursoAca));
          list.value = guias;
        }
        titulaciones.value = items?.titulaciones || [];
      });
  };

  onMounted(() => {
    selectSyllabus();
  });
</script>

<style lang="scss">
  .syllabus {
    border-top: 1px solid #d0d0d0;
    margin: 1.5rem 0 0 0;
    padding: 1rem 0;
    &__titulaciones {
      font-size: 0.875rem;
      list-style: none;
      margin: 0.5rem 0;
      padding: 0;
      li {
        margin: 0;
        padding: 0 0 0.75rem 0;
      }
    }
    &__type {
      display: block;
      font-size: 0.85rem;
      font-weight: 600;
      letter-spacing: 0.02rem;
      padding: 0 0 0.75rem 0;
    }
    &__title {
      font-size: 1.35rem;
      font-weight: 600;
      margin: 0 0 1.25rem 0;
      line-height: 1.15;
    }
    &__subtitle {
      font-size: 1.15rem;
      font-weight: 300;
      margin: 0 0 1rem 0;
    }
    &__link {
      display: inline-block;
      padding: 0 0 0.5rem 1rem;
      position: relative;
      &:hover {
        text-decoration: none;
      }
      &::before {
        content: '·';
        display: block;
        position: absolute;
        top: 8px;
        left: 0;
        color: black;
        font-size: 2rem;
        line-height: 0;
      }
    }
  }
</style>
