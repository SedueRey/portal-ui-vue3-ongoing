<template>
  <section id="myevents" class="myEventsMaximized">
    <h1 class="cardGroup__title">
      {{ $t('calendar') }}
    </h1>
    <div class="myEventsMaximized__data">
      <div class="myEventsMaximized__calendarContainer">
        <vue-cal
          class="vuecal--um-theme"
          small
          hide-view-selector
          click-to-navigate
          :time="false"
          active-view="month"
          :locale="locale"
          :disable-views="['week', 'day']"
          :todayButton="true"
          :events="events"
          @cell-click="onDayClick($event)"
          @view-change="updateData($event)"
        >
          <template v-slot:today-button>
            <span class="today pose__button button__secondary" @click="toToday()">
              {{ $t('today') }}
            </span>
          </template>
        </vue-cal>
      </div>
      <div class="myEventsMaximized__eventListContainer">
        <span :title="$t('showless')" class="myEventsMaximized__minimize" @click="emit('minimize')">
          <i class="fa-solid fa-down-left-and-up-right-to-center" />
          <span class="sr-only">{{ $t('showless') }}</span>
        </span>
        <aside class="myEventsMaximized__eventDetail">
          <my-events-list
            :is-today-day="today"
            :selected-day="selectedDay"
            :events="selectedEvents"
          />
        </aside>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
  import 'vue-cal/dist/vuecal.css';

  import { computed, onMounted, ref, type Ref } from 'vue';
  import { eventApiDTO2eventDTO, type EventResponseDTO, eventsApi } from '../api/events.api';
  import { locale } from '../composables/vueCalLocale';
  import MyEventsList from './MyEventsList.vue';
  import { useDate } from '@/app/shared/composables/useDate';
  import VueCal from 'vue-cal';

  const emit = defineEmits(['minimize']);

  const { fromDateToISO, isToday } = useDate();
  const today = ref(true);
  const events: Ref<EventResponseDTO[]> = ref([]);
  const selectedDay = ref(new Date().toISOString().slice(0, 10));

  const activeMonth = ref({
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
  });

  const selectedEvents = computed(() => {
    return !events.value.filter
      ? []
      : events.value.filter((el) => el.start <= selectedDay.value && el.end >= selectedDay.value);
  });

  const toToday = () => {
    today.value = true;
    selectedDay.value = fromDateToISO(new Date());
  };

  const onDayClick = (value) => {
    today.value = isToday(value);
    selectedDay.value = fromDateToISO(value);
  };

  const updateData = (value) => {
    activeMonth.value = {
      month: value.startDate.getMonth() + 1,
      year: value.startDate.getFullYear(),
    };
    getEvents();
  };

  const getEvents = () => {
    let previousMonth = activeMonth.value.month - 1;
    let previousYear = activeMonth.value.year;
    if (previousMonth <= 0) {
      previousMonth = 12;
      previousYear -= 1;
    }
    let nextMonth = activeMonth.value.month + 1;
    let nextYear = activeMonth.value.year;
    if (nextMonth > 12) {
      nextMonth = 1;
      nextYear += 1;
    }
    const nextMonthDays = new Date(nextYear, nextMonth, 0).getDate();
    const sinceMonth = String(previousMonth).padStart(2, '0');
    const toMonth = String(nextMonth).padStart(2, '0');
    const from = `01/${sinceMonth}/${previousYear}%2000:00`;
    const to = `${nextMonthDays}/${toMonth}/${nextYear}%2023:59`;
    eventsApi
      .events(from, to)
      .then((response) => response.data)
      .then((eventsFromApi) => {
        events.value = eventApiDTO2eventDTO(eventsFromApi.datos, events.value);
      });
  };

  onMounted(() => {
    getEvents();
  });
</script>

<style lang="scss">
  @import '@/app/shared/assets/_vuecal.scss';

  .myEventsMaximized {
    padding: 0;
    max-width: var(--grid-width);
    margin: 0 auto 2rem auto;
    @media (max-width: $screen-sm-min) {
      padding: 0 1rem;
    }

    &__data {
      align-items: stretch;
      border-radius: var(--card-border-radius);
      box-shadow: var(--shadowLevel-2);
      display: flex;
      flex-direction: row;
      margin: 1rem 0.5rem 0 0.5rem;
      position: relative;
      @media (max-width: $screen-sm-min) {
        flex-direction: column;
      }
    }

    &__calendarContainer {
      flex-shrink: 0;
      padding: 1rem;
      align-self: stretch;
      @media (max-width: $screen-xs-min) {
        height: 26rem;
      }
      @media (min-width: $screen-xs-min) {
        align-self: flex-start;
        width: 20rem;
        min-height: 20rem;
      }
    }

    &__minimize {
      position: absolute;
      top: -2.55rem;
      right: 0.75rem;
      cursor: pointer;
    }

    &__eventListContainer {
      background-color: var(--privatebgcolor);
      flex-grow: 1;
    }

    &__eventCalendar {
      @media (max-width: $screen-sm-min) {
        margin: 0 auto 1rem auto;
      }
    }

    &__toToday {
      &.pose__button {
        display: block;
        margin: 0.5rem auto 0 auto;
      }
    }

    &__eventDetail {
      padding: 0 0 0 1rem;
      flex-grow: 2;
      position: relative;
      @media (max-width: $screen-sm-min) {
        padding: 0 0 0.25rem 1rem;
      }
    }

    &__eventList {
      padding: 0 0;
      list-style: none;
      margin: 0 0;
      display: flex;
      flex-wrap: wrap;
      flex-direction: row;
      justify-content: space-between;
    }

    .vc-container {
      --red-600: var(--category1-color);
      --grey-600: #424242;

      font-family: var(--font-family);
      border-color: var(--border-color);
    }
  }
</style>
