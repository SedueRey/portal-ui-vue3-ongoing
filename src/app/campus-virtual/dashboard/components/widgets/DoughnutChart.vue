<template>
  <div class="doughnutchart md:w-15rem">
    <Chart
      type="doughnut"
      :data="chartDonughData"
      :options="donutOptions"
      class="w-full md:w-15rem"
      :canvasProps="{ role: 'img', 'aria-label': 'Data' }"
    />
    <div class="doughnutchart__data">
      <span class="doughnutchart__nota">
        <span class="doughnutchart__notaNumerica"> 6,5 </span>
        <br />
        Nota media
      </span>
    </div>
  </div>
</template>

<script lang="ts">
  import Chart from 'primevue/chart';
  import { defineComponent } from 'vue';

  export default defineComponent({
    name: 'DoughnutChart',
    components: {
      Chart,
    },
    data(): {
      donutOptions: Record<string, unknown>;
      chartDonughData: undefined | object;
    } {
      return {
        donutOptions: {
          plugins: {
            legend: {
              display: false,
            },
            tooltip: {
              showAll: true,
            },
          },
        },
        chartDonughData: undefined,
      };
    },
    mounted() {
      const documentStyle = getComputedStyle(document.body);
      this.chartDonughData = {
        labels: [
          '2º superados',
          '2º no superados',
          '2º no matriculados',
          '3º superados',
          '3º no matriculados',
          '4º superados',
          '4º no matriculados',
          '1º superados',
          '1º no superados',
          '1º no matriculados',
        ],
        datasets: [
          {
            data: [30, 20, 10, 0, 60, 0, 60, 54, 6, 0],
            backgroundColor: [
              documentStyle.getPropertyValue('--category3-color-light'),
              documentStyle.getPropertyValue('--category1-color-medium'),
              documentStyle.getPropertyValue('--category0-color-medium'),
              documentStyle.getPropertyValue('--category3-color-light'),
              documentStyle.getPropertyValue('--category0-color-medium'),
              documentStyle.getPropertyValue('--category3-color-light'),
              documentStyle.getPropertyValue('--category0-color-medium'),
              documentStyle.getPropertyValue('--category3-color-light'),
              documentStyle.getPropertyValue('--category1-color-light'),
              documentStyle.getPropertyValue('--category0-color-medium'),
            ],
            hoverBackgroundColor: [
              documentStyle.getPropertyValue('--category3-color'),
              documentStyle.getPropertyValue('--red-400'),
              documentStyle.getPropertyValue('--category3-color'),
              documentStyle.getPropertyValue('--red-400'),
              documentStyle.getPropertyValue('--category3-color'),
              documentStyle.getPropertyValue('--red-400'),
              documentStyle.getPropertyValue('--category3-color'),
              documentStyle.getPropertyValue('--red-400'),
            ],
          },
        ],
      };
    },
  });
</script>

<style lang="scss" scoped>
  .doughnutchart {
    position: relative;

    &__data {
      position: absolute;
      left: 50%;
      transform: translate(-50%, -50%);
      top: 50%;
      text-align: center;
    }
    &__notaNumerica {
      font-weight: 700;
      font-size: 1.15rem;
    }
    &__number {
      font-weight: 600;
      color: var(--message-color-success);
    }
  }
</style>
