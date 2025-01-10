<template>
  <article class="myEventModalDetail" v-if="detailEvent">
    <div class="myEventModalDetail__bg" @click="closeModal" tabindex="-1" />
    <div
      ref="myEventModalDetail"
      class="myEventModalDetail__inner"
      tabindex="0"
      @keydown.esc="closeModal"
    >
      <i
        class="fal fa-times myEventModalDetail__close"
        @click="closeModal"
        @keyup.enter="closeModal"
        @keyup.space="closeModal"
      ></i>
      <header :class="eventClass" class="myEventModalDetail__header" :style="bodyStyle">
        <h1 class="myEventModalDetail__title">{{ detailEvent.titulo }}</h1>
        <p class="myEventModalDetail__type" :style="typeStyle">
          {{ detailEvent.tipo }}
          <span v-if="detailEvent.subtipo"> · {{ detailEvent.subtipo }} </span>
        </p>
      </header>
      <div class="myEventModalDetail__when">
        <p class="myEventModalDetail__whenContainer">
          <i class="fal fa-clock myEventModalDetail__whenicon"></i>
          <time :datetime="detailEvent.inicio" class="myEventModalDetail__starttime">
            {{ startTimeConverted }}h
          </time>
          <span v-if="sameDay">
            &ndash;
            <time :datetime="detailEvent.fin"> {{ endTimeConvertedTime }}h </time>
          </span>
        </p>
        <p v-if="!oneTimeValue && !detailEvent.dia && !sameDay">
          {{ $t('tom') }}
          <time :datetime="detailEvent.fin" class="myEventModalDetail__endtime">
            {{ endTimeConverted }}h
          </time>
        </p>
        <p
          class="myEventModalDetail__whenContainer preserve-whitespaces"
          v-if="detailEvent.ubicacion"
        >
          <i class="fas fa-map-marker-alt myEventModalDetail__whenicon"></i
          >{{ detailEvent.ubicacion }}
        </p>
        <p v-if="detailEvent.localizacion" class="myEventModalDetail__whenContainer">
          <i class="fal fa-link myEventModalDetail__whenicon"></i>
          <a :href="detailEvent.localizacion">Localización</a>
        </p>
      </div>
      <div
        class="myEventModalDetail__description preserve-whitespaces"
        v-html="linkedDescription"
      />
    </div>
  </article>
</template>

<script lang="ts">
  import { computed, defineComponent, onMounted, ref } from 'vue';
  import { linkify } from '@/app/shared/utils/utils';

  export default defineComponent({
    props: {
      detailEvent: { type: Object, default: null, required: true },
    },
    computed: {
      locale() {
        return this.$i18n && this.$i18n.locale ? this.$i18n.locale : 'es';
      },
      startTimeFormatted() {
        const pieces = this.detailEvent.inicio.split(' ');
        if (pieces.length > 0) {
          pieces[0] = pieces[0].split('/').reverse().join('-');
        }
        return pieces.join(' ');
      },
      startTimeConverted() {
        const date = new Date(this.startTimeFormatted);
        return `${date.toLocaleDateString(this.locale, {
          weekday: 'long',
          month: 'short',
          day: 'numeric',
        })}. ${date.toLocaleTimeString(this.locale, { hour: '2-digit', minute: '2-digit' })}`;
      },
      endTimeFormatted() {
        const pieces = this.detailEvent.fin.split(' ');
        if (pieces.length > 0) {
          pieces[0] = pieces[0].split('/').reverse().join('-');
        }
        return pieces.join(' ');
      },
      endTimeConverted() {
        const date = new Date(this.endTimeFormatted);
        return `${date.toLocaleDateString(this.locale, {
          weekday: 'long',
          month: 'short',
          day: 'numeric',
        })}. ${date.toLocaleTimeString(this.locale, { hour: '2-digit', minute: '2-digit' })}`;
      },
      endTimeConvertedTime() {
        const date = new Date(this.endTimeFormatted);
        return `${date.toLocaleTimeString(this.locale, { hour: '2-digit', minute: '2-digit' })}`;
      },
      sameDay() {
        const iniDate = new Date(this.startTimeFormatted);
        const endDate = new Date(this.endTimeFormatted);
        return (
          iniDate.getFullYear() === endDate.getFullYear() &&
          iniDate.getMonth() === endDate.getMonth() &&
          iniDate.getDate() === endDate.getDate()
        );
      },
    },
    setup(props, context) {
      const closeModal = () => {
        context.emit('closeModal');
      };
      const myEventModalDetail = ref<HTMLElement | null>(null);
      const eventClass = computed(() => `modalcalendar-${props.detailEvent.tipo.toLowerCase()}`);
      const bodyStyle = computed(
        () =>
          `border-color: var(--calendar-${props.detailEvent.codigo_tipo}-${props.detailEvent.codigo_subtipo})`,
      );
      const typeStyle = computed(
        () => `color: var(--calendar-${props.detailEvent.codigo_tipo}-text)`,
      );
      const oneTimeValue = computed(
        () => props.detailEvent.starthour === props.detailEvent.endhour,
      );
      const linkedDescription = computed(() =>
        linkify(props.detailEvent.descripcion, 'link', '_blank'),
      );
      onMounted(() => {
        if (myEventModalDetail.value) {
          myEventModalDetail.value.focus();
        }
      });
      return {
        myEventModalDetail,
        closeModal,
        eventClass,
        bodyStyle,
        typeStyle,
        oneTimeValue,
        linkedDescription,
      };
    },
  });
</script>

<i18n>
{
  "en": {
    "tom": "to"
  },
  "es": {
    "tom": "hasta",
  }
}
</i18n>

<style lang="scss">
  .myEventModalDetail {
    position: fixed;
    top: var(--header-size);
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 5;
    max-height: 100vh;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    &__bg {
      backdrop-filter: blur(3px);
      background-color: rgba(0, 0, 0, 0.28);
      bottom: 0;
      left: 0;
      max-height: 100vh;
      position: fixed;
      right: 0;
      top: var(--header-size);
      z-index: 5;
    }

    &__inner {
      background-color: var(--card-bg-color);
      border-radius: var(--card-border-radius);
      z-index: 6;
      width: 33rem;
      margin: 1rem;
      padding: 3rem 0 0 0;
      box-shadow: var(--shadowLevel-2);
      position: relative;
      @media (max-width: $screen-xs-min) {
        width: calc(100vw - 2rem);
      }
      &:focus {
        outline: 0;
      }
    }

    &__close {
      font-size: 1.8rem;
      position: absolute;
      right: 1.4rem;
      top: 1.1rem;
      cursor: pointer;
    }

    &__header {
      padding: 0.875rem 1.5rem;
      margin: 1rem 1rem 2rem 2rem;
      border-left: 0.3125rem solid;
      position: relative;
      &::before {
        content: '';
        display: block;
        position: absolute;
        top: -2px;
        bottom: -2px;
        left: -7px;
        width: 0.31rem;
        background: transparent;
        border: 2px solid white;
        border-radius: 1rem;
      }
    }

    &__title {
      color: var(--title-color);
      font-size: 1.25rem;
      padding: 0;
      margin: 0 0 0.5rem 0;
      display: -webkit-box;
      -webkit-line-clamp: 3;
      line-clamp: 3;
      -webkit-box-orient: vertical;
      overflow: hidden;
      text-overflow: ellipsis;
      @media (max-width: $screen-xs-min) {
        font-size: 1.15rem;
      }
    }

    &__type {
      font-size: 0.875rem;
      margin: 0;
    }

    &__starttime,
    &__endtime {
      display: inline-block;
      &::first-letter {
        text-transform: uppercase;
      }
      & + span {
        display: inline-block;
        margin: 0 0 0 0.25rem;
      }
    }

    &__when {
      background-color: var(--nav-button-color);
      padding: 1rem 2rem;
    }

    &__whenicon {
      margin: 0.3rem 0 0 -2rem;
      position: absolute;
    }

    &__whenContainer {
      padding: 0 0 0 1.7rem;
    }

    &__description {
      padding: 2rem 2rem 2rem 3.6rem;
      max-height: 40vh;
      overflow: auto;
      @media (max-width: $screen-phone) {
        max-height: 25vh;
      }
    }
  }

  .preserve-whitespaces {
    white-space-collapse: preserve;
  }
</style>
