<template>
  <div class="calendarevent" :style="styleData" @click="showDetails">
    <article class="calendarevent" :class="eventClass">
      <div class="calendarevent__body" :style="bodyStyle">
        <h3 class="calendarevent__title">{{ event.titulo }}</h3>
        <span class="calendarevent__date" v-if="event.dia">
          <time v-if="showDay" :datetime="event.inicio">
            {{ fromDateToEULongMonthDay(toDateFormat(event.inicio)) }},
          </time>
          {{ $t('allDay') }}
        </span>
        <span class="calendarevent__dateText" v-else>
          <time v-if="showDay" :datetime="event.inicio">
            {{ fromDateToEULongMonthDay(toDateFormat(event.inicio)) }},
          </time>
          <time :datetime="event.inicio" class="calendarevent__starttime">
            {{ timeFormat(event.inicio) }}
          </time>
          <time
            v-if="!oneTimeValue && !event.dia"
            :datetime="event.fin"
            class="calendarevent__endtime"
          >
            - {{ timeFormat(event.fin) }}
          </time>
        </span>
        <p class="calendarevent__type" :style="typeStyle">
          {{ event.tipo }}
          <span v-if="event.subtipo"> · {{ event.subtipo }} </span>
        </p>
      </div>
    </article>
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue';
  import { useDate } from '@/app/shared/composables/useDate';

  const props = defineProps({
    event: { type: Object, required: true },
    showDay: { type: Boolean, required: false, default: false },
  });

  const emit = defineEmits(['showEventDetail']);

  const { fromDateToEULongMonthDay, toDateFormat, timeFormat } = useDate();

  const styleData = computed(() => `order: ${props.event.starthour.replace(':', '')}`);
  const eventClass = computed(() => `calendar-${props.event.tipo.toLowerCase()}`);
  const bodyStyle = computed(
    () => `border-color: var(--calendar-${props.event.codigo_tipo}-${props.event.codigo_subtipo})`,
  );
  const typeStyle = computed(() => `color: var(--calendar-${props.event.codigo_tipo}-text)`);
  const oneTimeValue = computed(() => props.event.starthour === props.event.endhour);

  function showDetails() {
    emit('showEventDetail', props.event);
  }
</script>

<style lang="scss">
  @import '../assets/_events';

  .calendarevent {
    align-items: center;
    cursor: pointer;
    display: flex;
    flex-direction: row;
    font-size: 0.875rem;
    margin: 0 0 0.25rem 0;
    width: calc(100% - 0.5rem);

    &.calensdar-festivo {
      .calendarevents_c_body {
        background-image: url('/img/party.svg');
        background-position: 98% center;
        background-repeat: no-repeat;
        min-height: 4.68rem;
      }
      .calendarevent__title {
        margin: 0;
      }
      .calendarevent__type {
        display: none;
      }
    }

    &__header {
      align-self: center;
      flex-grow: 0;
      min-width: 3rem;
      padding: 1rem 0;
      width: 3rem;
    }

    &__dateText {
      display: flex;
      gap: 0.15rem;
    }

    &__starttime {
      display: block;
      font-size: 0.75rem;
    }

    &__starttimedate {
      display: block;
      font-size: 0.75rem;
    }

    &__endtime {
      display: block;
      font-size: 0.75rem;
    }

    &__body {
      background: #fff;
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      justify-content: center;
      padding: 1rem;
      gap: 0.25rem;
      border-radius: 6px;
      border-left: 6px solid;
      flex-grow: 1;
      box-shadow: var(--shadowLevel-1);
    }

    &__title {
      color: var(--main-text-color);
      padding: 0;
      margin: 0 0 0 0;
      font-size: 0.875rem;
    }

    &__type {
      font-size: 0.75rem;
      font-weight: 500;
      color: var(--menutitlecolor);
      padding: 0;
      margin: 0;
    }
  }
</style>
