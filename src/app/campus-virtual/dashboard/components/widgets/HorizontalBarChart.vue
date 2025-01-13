<template>
  <div class="card">
    <Chart type="bar" :data="chartData" :options="chartOptions" class="h-3rem" />
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
      labels: [''],
      datasets: [
        {
          label: 'Superados',
          backgroundColor: documentStyle.getPropertyValue('--category3-color-light'),
          data: [90],
        },
        {
          label: 'No superados',
          backgroundColor: documentStyle.getPropertyValue('--category1-color-light'),
          data: [10],
        },
        {
          label: 'No matriculados',
          backgroundColor: documentStyle.getPropertyValue('--category0-color-medium'),
          data: [140],
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
      indexAxis: 'y',
      maintainAspectRatio: false,
      aspectRatio: 0.8,
      plugins: {
        legend: {
          display: false,
          labels: {
            fontColor: textColor,
          },
        },
      },
      scales: {
        x: {
          stacked: true,
          ticks: {
            display: false,
          },
          grid: {
            display: false,
            drawBorder: false,
          },
        },
        y: {
          stacked: true,
          ticks: {
            color: textColorSecondary,
          },
          grid: {
            color: surfaceBorder,
            drawBorder: false,
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
