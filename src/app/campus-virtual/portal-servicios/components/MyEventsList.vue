<template>
  <div>
    <my-event-modal-detail
      v-if="selectedEvent"
      :detailEvent="selectedEvent"
      @closeModal="resetSelectedEvent"
    />
    <h2 v-if="isTodayDay" class="myeventslist__subtitle">
      {{ $t('todayEvents') }}
    </h2>
    <h2 v-else class="myeventslist__subtitle">
      {{ readableDate }}
      <span v-if="events.length > 4" class="myeventslist__eventsLength">
        {{ events.length }}
        {{ $t('dayEvents') }}
      </span>
    </h2>
    <p class="myeventslist__nodata" v-if="events.length === 0">
      <span class="myeventslist__nodataIcon">
        <i class="fad fa-calendar-alt"></i>
      </span>
      <span class="myeventslist__nodataText">
        {{ $t('noEvents') }}
      </span>
    </p>
    <div v-else>
      <div class="myeventslist__eventList">
        <span
          class="myeventslist__hourDivider"
          v-if="isTodayDay && events.length > 1"
          :style="styleNow"
        >
          <span>
            {{ now }}
          </span>
          <div />
        </span>
        <my-events-detail
          :event="event"
          v-for="(event, index) in sortedEvents"
          :key="index"
          @showEventDetail="showModalEvent"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed, onMounted, onUnmounted, type Ref, ref } from 'vue';
  import type { EventResponseDTO } from '../api/events.api';
  import MyEventModalDetail from './MyEventModalDetail.vue';
  import MyEventsDetail from './MyEventsDetail.vue';

  const props = defineProps<{
    isTodayDay: boolean;
    selectedDay: string;
    events: EventResponseDTO[];
  }>();

  const now = ref('');
  const countdown: Ref<ReturnType<typeof setTimeout> | null> = ref(null);
  const selectedEvent = ref(null);

  const styleNow = computed(() => `order: ${now.value.replace(':', '')};`);

  const readableDate = computed(() => {
    const formattedDate = new Date(props.selectedDay).toLocaleDateString(undefined, {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
    return formattedDate.charAt(0).toLocaleUpperCase() + formattedDate.slice(1);
  });

  const sortedEvents = computed(() => {
    return [...props.events].sort(
      (a, b) =>
        parseInt(a.starthour.replace(':', '') || '0', 10) -
        parseInt(b.starthour.replace(':', '') || '0', 10),
    );
  });

  const getNow = () => {
    now.value = new Date().toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
  };

  const showModalEvent = (evt) => {
    selectedEvent.value = evt;
  };

  const resetSelectedEvent = () => {
    selectedEvent.value = null;
  };

  onMounted(() => {
    getNow();
    countdown.value = setInterval(() => {
      getNow();
    }, 60000);
  });

  onUnmounted(() => {
    if (countdown.value) {
      clearInterval(countdown.value);
    }
  });
</script>

<style lang="scss">
  .myeventslist {
    &__subtitle {
      font-size: 0.875rem;
      font-weight: 400;
      margin: 0;
      padding: 0.875rem 0 0.75rem 0;
    }
    &__eventsLength {
      font-weight: 400;
    }
    &__button {
      padding: 1rem;
    }
    &__navigator {
      margin: 0 0 1rem 0;
      font-size: 0.75rem;
      font-weight: 500;
    }
    &__eventList {
      list-style: none;
      padding: 0;
      margin: 0;
      display: flex;
      flex-direction: column;
      @media (min-width: $screen-xs-min) {
        overflow-y: auto;
        max-height: 19rem;
      }
    }
    &__hourDivider {
      align-items: center;
      color: var(--main-color);
      display: flex;
      flex-direction: row;
      font-size: 0.75rem;
      margin: 0 1rem 0 0;
      > span {
        padding: 0 1rem 0 0;
      }
      > div {
        background: var(--main-color);
        height: 1px;
        width: 100%;
        position: relative;
        &::before {
          content: '';
          position: absolute;
          top: -0.25rem;
          background-color: var(--main-color);
          border-radius: 100%;
          display: block;
          height: 0.5rem;
          width: 0.5rem;
        }
      }
    }
    &__buttonContainer {
      // position: absolute;
      bottom: 0;
      left: 1rem;
    }
    &__nodata {
      align-items: center;
      display: flex;
      flex-direction: column;
      justify-content: center;
      min-height: 14rem;
      @media (max-width: $screen-sm-min) {
        margin: -2.5rem 0 0 0;
      }
    }
    &__nodataIcon {
      display: block;
      font-size: 5rem;
      opacity: 0.4;
    }
    &__nodataText {
      font-weight: 700;
    }
  }
</style>
