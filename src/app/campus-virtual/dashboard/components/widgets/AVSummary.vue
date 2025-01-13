<template>
  <article class="aulaVirtualSummary">
    <h1>
      Tareas activas:
      <Button
        label="Mi Aula Virtual"
        class="p-button-sm p-button-secondary"
        icon="fa fas fa-users-class"
      />
    </h1>
    <ul class="aulaVirtualSummary__activeTasks assignmentlist">
      <li class="assignment">
        <span class="assignment__duedate">Entrega en 3h</span>
        <span class="assignment__name">Proyecto de práctico final</span>
        <span class="assignment__subject">[2345] Nombre de asignatura</span>
      </li>
      <li class="assignment">
        <span class="assignment__duedate">Entrega en 3h</span>
        <span class="assignment__name">
          Proyecto de práctico final con el nombre muy largo para que pueda salir y poner elipsis
        </span>
        <span class="assignment__subject">
          [2345] Nombre de asignatura con el nombre excesivamente largo también y tal y qué dolor
          dentro de un armario
        </span>
      </li>
      <li class="assignment">
        <span class="assignment__duedate">Entrega en 3h</span>
        <span class="assignment__name">Proyecto de práctico final</span>
        <span class="assignment__subject">[2345] Nombre de asignatura</span>
      </li>
      <li class="assignment">
        <span class="assignment__duedate">Entrega en 3h</span>
        <span class="assignment__name">Proyecto de práctico final</span>
        <span class="assignment__subject">[2345] Nombre de asignatura</span>
      </li>
      <li class="assignment">
        <span class="assignment__duedate">Entrega en 3h</span>
        <span class="assignment__name">Proyecto de práctico final</span>
        <span class="assignment__subject">[2345] Nombre de asignatura</span>
      </li>
    </ul>
  </article>
</template>

<script lang="ts">
  import Button from 'primevue/button';
  import { defineComponent } from 'vue';

  export default defineComponent({
    name: 'CourseSummary',
    components: {
      // eslint-disable-next-line vue/no-reserved-component-names
      Button,
    },
  });
</script>

<style lang="scss">
  .dashboardWidget:has(.aulaVirtualSummary) {
    box-shadow: unset;
    background-color: unset;
    box-shadow: unset;
    &:hover {
      box-shadow: unset;
    }

    .p-button-sm {
      float: right;
      background-color: var(--card-bg-color);
    }

    @container dashboardwidget (max-width: 500px) {
      .p-button-sm {
        display: block;
        float: unset;
        margin: 1rem 0 0 0;
        width: 100%;
        padding: 0.5rem 0.25rem;
      }
      ul {
        padding: 0 0 0 1rem;
        li {
          margin-bottom: 0 0 0.5rem 0;
        }
      }
    }

    .assignmentlist {
      clear: both;
      list-style: none;
      margin: 2rem 0 0 0;
      padding: 0 0 0 0;
      display: flex;
      flex-direction: row;
      gap: 0.25rem;
      flex-wrap: wrap;
      justify-content: space-between;
      @container dashboardwidget (max-width: 500px) {
        flex-direction: column;
        gap: 0;
        margin: 1rem -1rem;
      }
    }

    .assignment {
      padding: 1rem;
      background-color: var(--card-bg-color);
      border-radius: var(--card-border-radius);
      box-shadow: var(--shadowLevel-1);
      box-sizing: border-box;
      margin-bottom: 0.5rem;
      width: 100%;
      @container dashboardwidget (min-width: 500px) {
        width: calc(50% - 0.25rem);
      }

      &__duedate {
        font-weight: 300;
        font-size: 0.75rem;
        display: block;
      }
      &__name {
        font-weight: 500;
        font-size: 0.875rem;
        display: block;
        white-space: nowrap;
        max-width: 100%;
        text-overflow: ellipsis;
        overflow: hidden;
      }
      &__subject {
        display: block;
        font-size: 0.75rem;
        font-weight: 300;
        white-space: nowrap;
        max-width: 100%;
        text-overflow: ellipsis;
        overflow: hidden;
      }
    }
  }
</style>
