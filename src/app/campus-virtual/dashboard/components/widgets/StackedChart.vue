<template>
  <div class="card">
    <Chart type="bar" :data="chartData" :options="chartOptions" class="h-18rem" />
  </div>
</template>

<script setup lang="ts">
  import { onMounted, ref } from 'vue';
  import Chart from 'primevue/chart';

  const chartData = ref();
  const chartOptions = ref();

  const setChartData = () => {
    const documentStyle = getComputedStyle(document.documentElement);

    return {
      labels: ['1º', '2º', '3º', '4º'],
      datasets: [
        {
          type: 'bar',
          label: 'Superados',
          backgroundColor: documentStyle.getPropertyValue('--category3-color-light'),
          data: [54, 30, 0, 0],
        },
        {
          type: 'bar',
          label: 'No superados',
          backgroundColor: documentStyle.getPropertyValue('--category1-color-light'),
          data: [6, 20, 0, 0],
        },
        {
          type: 'bar',
          label: 'No matriculados',
          backgroundColor: documentStyle.getPropertyValue('--category0-color-medium'),
          data: [0, 10, 60, 60],
        },
      ],
    };
  };
  const setChartOptions = () => {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');
    const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
    const surfaceBorder = documentStyle.getPropertyValue('--surface-border');

    return {
      maintainAspectRatio: false,
      aspectRatio: 1.4,
      plugins: {
        tooltips: {
          mode: 'index',
          intersect: false,
        },
        legend: {
          labels: {
            color: textColor,
          },
        },
      },
      scales: {
        x: {
          stacked: true,
          ticks: {
            color: textColorSecondary,
          },
          grid: {
            color: surfaceBorder,
          },
        },
        y: {
          stacked: true,
          ticks: {
            color: textColorSecondary,
          },
          grid: {
            color: surfaceBorder,
          },
        },
      },
    };
  };

  onMounted(() => {
    chartData.value = setChartData();
    chartOptions.value = setChartOptions();
  });
</script>
