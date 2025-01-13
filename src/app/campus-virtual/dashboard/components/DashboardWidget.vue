<template>
  <div class="dashboardWidget">
    <component class="dashboardWidget__component" :is="widgetComponent" />
  </div>
</template>

<script lang="ts">
  import { defineAsyncComponent, defineComponent } from 'vue';

  export default defineComponent({
    name: 'dashboardWidget',
    props: {
      widgetName: {
        type: String,
        required: true,
      },
    },
    computed: {
      widgetComponent() {
        return defineAsyncComponent(() => import('./widgets/' + this.widgetName + '.vue'));
      },
    },
  });
</script>

<style lang="scss">
  .dashboardWidget {
    font-size: 0.875rem;
    padding: 1rem;
    background-color: var(--card-bg-color);
    border-radius: var(--card-border-radius);
    box-shadow: var(--shadowLevel-1);
    box-sizing: border-box;
    margin-bottom: 0.5rem;
    transition: all 0.2s linear;
    will-change: box-shadow;
    /* CSS Container queries */
    container-type: inline-size;
    container-name: dashboardwidget;

    &:hover {
      box-shadow: var(--shadowLevel-2);
    }

    h1 {
      font-size: 1.15rem;
      line-height: 1.15;
      padding: 0;
      margin: 0;
    }
  }

  @container dashboardwidget (max-width: 500px) {
    .dashboardWidget__component {
      font-size: 0.75rem;
      padding: 0.25rem;
      margin: -0.25rem;
    }
    .dashboardWidget__component h1 {
      font-size: 1rem;
    }
  }
</style>
