<template>
  <div class="dashboard__container" v-if="shouldShow">
    <section class="dashboard" id="dashboard">
      <div class="column" v-for="(columns, index) in widgetsOrderedGrouped" :key="index">
        <div v-for="(item, index) in columns" :key="index">
          <DashboardWidget :widgetName="item.name" />
        </div>
      </div>
    </section>
  </div>
</template>

<script lang="ts">
  import DashboardWidget from './DashboardWidget.vue';
  import { DashboardWidgetsMockService } from '@/services/campus-virtual/DashboardWidgetService';
  import { defineComponent } from 'vue';

  export default defineComponent({
    name: 'DashboardComponent',
    components: {
      DashboardWidget,
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data(): { widgets: any[]; components: any[] } {
      return {
        widgets: [],
        components: [],
      };
    },
    computed: {
      shouldShow() {
        // Esta parte de la feature flag se eliminará
        // cuando esté el backend.
        const featureFlagActive = window.sessionStorage.getItem('featureFlagActive');
        // Fin feature flag
        return !!featureFlagActive;
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      widgetsOrderedGrouped(): any[][] {
        const widgetGrouped = [];
        const columns = [...new Set(this.widgets.map((el) => el.position.column))].sort();
        for (let col = 1; col <= columns.length; col += 1) {
          const widgetColums = this.widgets
            .filter((el) => el.position.column === col)
            .sort((a, b) => a.position.order - b.position.order);
          widgetGrouped.push(widgetColums as never);
        }
        return widgetGrouped.filter((el) => !!el);
      },
    },
    async mounted() {
      this.widgets = await DashboardWidgetsMockService(3, 5);
    },
  });
</script>

<style lang="scss">
  #dashboard {
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;
    gap: 0.5rem;

    @media (min-width: $screen-sm-min) {
      flex-direction: row;
    }

    .column:first-child {
      @media (min-width: $screen-sm-min) {
        min-width: 17rem;
        width: 20%;
      }
    }
    .column:not(:first-child) {
      @media (min-width: $screen-sm-min) {
        flex-grow: 2;
      }
    }
  }
</style>

<style lang="scss" scoped>
  .dashboard {
    margin: 0 auto;
    max-width: var(--grid-width);
    padding: 1.35rem 0.4rem;

    &__container {
      background-color: var(--privatebgcolor);
      padding: 1rem 0;
      margin: 0 0 1rem 0;
    }

    h1 {
      color: var(--title-color);
      font-family: var(--font-family);
      font-weight: 700;
      font-size: 1.5rem;
      line-height: 1;
      margin: 0 0 0 0;
      padding: 0.3rem 1rem 0.4rem 0;
    }
  }
</style>
