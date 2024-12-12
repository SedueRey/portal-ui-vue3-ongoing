<template>
  <div class="base-timer">
    <svg
      class="base-timer__svg"
      viewBox="0 0 100 100"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g class="base-timer__circle">
        <circle
          class="base-timer__path-elapsed"
          cx="50"
          cy="50"
          r="45"
        ></circle>
        <path
          :stroke-dasharray="circleDasharray"
          class="base-timer__path-remaining"
          d="
            M 50, 50
            m -45, 0
            a 45,45 0 1,0 90,0
            a 45,45 0 1,0 -90,0
          "
        ></path>
      </g>
    </svg>
    <div class="base-timer__label">{{ formattedTimeLeft }}</div>
  </div>
</template>

<script lang="ts" setup>
  import { computed, onMounted, ref, type Ref, watch } from 'vue';

  const FULL_DASH_ARRAY = 283;

  const props = defineProps({
    timeLimit: {
      type: Number,
      required: true,
    },
  });

  const timePassed: Ref<number> = ref(0);
  const timerInterval: Ref<null | ReturnType<typeof setTimeout>> = ref(null);

  const timeLeft = computed(() => props.timeLimit - timePassed.value);

  const timeFraction = computed(() => {
    const rawTimeFraction = timeLeft.value / props.timeLimit;
    return rawTimeFraction - (1 / props.timeLimit) * (1 - rawTimeFraction);
  });

  const circleDasharray = computed(
    () => `${(timeFraction.value * FULL_DASH_ARRAY).toFixed(0)} 283`,
  );

  const formattedTimeLeft = computed(() => {
    const seconds = timeLeft.value % 60;
    return seconds < 10 ? `0${seconds}` : `${seconds}`;
  });

  const onTimesUp = () => {
    if (timerInterval.value) clearInterval(timerInterval.value);
  };

  const startTimer = () => {
    timerInterval.value = setInterval(() => {
      timePassed.value += 1;
    }, 1000);
  };

  watch(timeLeft, (newValue) => {
    if (newValue === 0) {
      onTimesUp();
    }
  });

  onMounted(() => {
    startTimer();
  });
</script>

<style scoped lang="scss">
  .base-timer {
    height: 100px;

    &__svg {
      transform: scaleX(-1);
      width: 100px;
      height: 100px;
    }
    &__circle {
      fill: none;
      stroke: none;
    }
    &__path-elapsed {
      stroke-width: 10px;
      stroke: var(--gris-oscuro-400);
    }
    &__path-remaining {
      stroke-width: 10px;
      stroke-linecap: round;
      transform: rotate(90deg);
      transform-origin: center;
      transition: 1s linear all;
      fill-rule: nonzero;
      stroke: currentColor;
      color: var(--azul-gestion-100);
    }
    &__label {
      line-height: 1em;
      font-size: 36px;
      margin-top: -73px;
    }
  }
</style>
