<template>
  <div class="myEventsMinimized">
    <my-event-modal-detail
      v-if="selectedEvent"
      :detailEvent="selectedEvent"
      @closeModal="resetSelectedEvent"
    />
    <div class="myEventsMinimized__eventListContainer">
      <span :title="$t('showmore')" class="myEventsMinimized__maximize" @click="$emit('maximize')">
        <i class="fas fa-expand-alt" />
        <span class="sr-only">{{ $t('showmore') }}</span>
      </span>
      <aside class="myEventsMinimized__eventDetail">
        <div>
          <h1 class="myEventsMinimized__subtitle">{{ $t('calendar') }} / {{ $t('nextEvents') }}</h1>
          <p class="myEventsMinimized__nodata" v-if="!loading && events.length === 0">
            <span class="myEventsMinimized__nodataIcon">
              <i class="fad fa-calendar-alt"></i>
            </span>
            <span class="myEventsMinimized__nodataText">
              {{ $t('notFound') }}
            </span>
          </p>
          <div class="myEventsMinimized__events" v-else-if="!loading">
            <my-events-detail
              :event="event"
              v-for="(event, index) in sortedEvents"
              :key="index"
              :showDay="true"
              @showEventDetail="showModalEvent"
            />
          </div>
          <p class="myEventsMinimized__nodata" v-if="loading">
            <span class="myEventsMinimized__nodataIcon">
              <i class="fa-duotone fa-spinner fa-spin"></i>
            </span>
            <span class="myEventsMinimized__nodataText">
              {{ $t('loading') }}
            </span>
          </p>
        </div>
      </aside>
    </div>
  </div>
</template>

<script lang="ts">
  import { eventApiDTO2eventDTO, type EventResponseDTO, eventsApi } from '../api/events.api';
  import { defineComponent } from 'vue';
  import MyEventModalDetail from './MyEventModalDetail.vue';
  import MyEventsDetail from './MyEventsDetail.vue';

  export default defineComponent({
    name: 'MyEventsMinimized',
    emits: ['maximize'],
    components: {
      MyEventsDetail,
      MyEventModalDetail,
    },
    computed: {
      sortedEvents() {
        return [...this.events].sort(
          (a: EventResponseDTO, b: EventResponseDTO) =>
            parseInt(a.starthour.replace(':', '') || '0', 10) -
            parseInt(b.starthour.replace(':', '') || '0', 10),
        );
      },
    },
    data() {
      return {
        events: [],
        loading: false,
        selectedEvent: null,
      };
    },
    methods: {
      showModalEvent(evt) {
        this.selectedEvent = evt;
      },
      resetSelectedEvent() {
        this.selectedEvent = null;
      },
    },
    async mounted() {
      const now = new Date();
      const from = `${now.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      })}%2000:00`;
      now.setDate(now.getDate() + 30);
      const to = `${now.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      })}%2023:59`;
      this.loading = true;
      eventsApi
        .events(from, to)
        .then((response) => response.data)
        .then((eventsFromApi) => {
          if (eventsFromApi) {
            this.events = eventApiDTO2eventDTO(eventsFromApi.datos) as never[];
          }
          this.loading = false;
        });
    },
  });
</script>

<i18n>
{
  "en": {
    "calendar": "My calendar",
    "nextEvents": "Events within the next 30 days",
    "notFound": "No events found",
    "loading": "Loading events",
    "showmore": "Show more"
  },
  "es": {
    "calendar": "Mi agenda",
    "nextEvents": "Eventos en los próximos 30 días",
    "notFound": "No se han encontrado eventos",
    "loading": "Cargando eventos",
    "showmore": "Mostrar más"
  }
}
</i18n>

<style lang="scss">
  .myEventsMinimized {
    margin: 0 auto 1rem auto;
    max-width: var(--grid-width);
    padding: 0;
    position: relative;

    @media (max-width: $screen-sm-min) {
      padding: 0 1rem;
    }

    &__subtitle {
      font-size: 0.875rem;
      font-weight: 400;
      margin: 0;
      padding: 0.875rem 0 0.75rem 0;
    }

    &__eventDetail {
      background-color: var(--privatebgcolor);
      border-radius: var(--card-border-radius);
      box-shadow: var(--shadowLevel-2);
      padding: 0 1rem 0.1rem 1rem;
      margin: 1rem 0.5rem 0 0.5rem;
      max-height: 17rem;
      overflow-y: auto;
    }

    &__nodata {
      align-items: center;
      display: flex;
      flex-direction: column;
      justify-content: center;
      min-height: 9rem;
      position: relative;
      top: -2rem;
      @media (max-width: $screen-sm-min) {
        padding: 0 0 1rem 0;
        top: -1rem;
      }
    }

    &__events {
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;
      gap: 1rem;
      margin: 0 0 1rem 0;
      > .calendarevent {
        @media (min-width: $screen-sm-min) {
          width: calc(50% - 0.5rem);
          &:only-of-type {
            width: 100%;
          }
        }
        .calendarevent {
          align-items: stretch;
          font-size: 0.75rem;
        }
        .calendarevent__body {
          padding: 0.75rem;
        }
        .calendarevent__title {
          font-size: 0.75rem;
        }
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

    &__maximize {
      cursor: pointer;
      position: absolute;
      top: 0.65rem;
      right: 1.25rem;
    }
  }
</style>
