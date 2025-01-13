<template>
  <article v-if="curso" class="courseSummary">
    <h1>
      <span class="courseSummary__grado"> Grado en Biología </span>
      {{ curso.cursoNombre }}
      <span class="courseSummary__cursoAcademico">
        {{ curso.cursoAcademico }} /
        {{ curso.cursoAcademico + 1 }}
      </span>
    </h1>
    <ul>
      <li>
        <span class="courseSummary__matriculados">
          {{ curso.matriculados }}
        </span>
        créditos matriculados
      </li>
      <li>
        <span class="courseSummary__pendientes"> {{ curso.pendientes }}</span> créditos pendientes
      </li>
      <li>
        <span class="courseSummary__aprobados"> {{ curso.aprobados }}</span> créditos aprobados
      </li>
    </ul>
  </article>
</template>

<script lang="ts">
  import { CursoAcademicoService } from '@/services/acade/MatriculaMockService';
  import { defineComponent } from 'vue';

  interface CursoSumario {
    cursoNombre: string;
    cursoAcademico: number;
    matriculados: number;
    pendientes: number;
    aprobados: number;
  }

  export default defineComponent({
    name: 'CourseSummary',
    data(): { curso: CursoSumario | null } {
      return {
        curso: null,
      };
    },
    async mounted() {
      this.curso = (await CursoAcademicoService()) as CursoSumario;
    },
  });
</script>

<style lang="scss">
  .courseSummary {
    &__grado {
      display: block;
      font-size: 0.75rem;
      font-weight: 300;
      @container dashboardwidget (max-width: 500px) {
        display: none;
      }
    }

    &__cursoAcademico {
      display: block;
      font-size: 0.75rem;
      font-weight: 300;
    }
    @container dashboardwidget (max-width: 500px) {
      ul {
        padding: 0 0 0 1rem;
        li {
          margin-bottom: 0 0 0.5rem 0;
        }
      }
    }
  }
</style>
