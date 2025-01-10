<template>
  <aside class="searchFeedback" v-if="shouldShow">
    <h1 class="searchFeedback__title">
      {{ $t('title') }}
    </h1>
    <div class="searchFeedback__thumbContainer">
      <span class="searchFeedback__thumb" :class="isThumbUp" @click="thumbUp()">
        <i class="fa-duotone fa-thumbs-up"></i>
      </span>
      <span class="searchFeedback__thumb" :class="isThumbDown" @click="thumbDown()">
        <i class="fa-duotone fa-thumbs-down"></i>
      </span>
    </div>
    <label v-if="isThumbDown" for="searchFeedback__title">
      <span class="searchFeedback__subtitle">
        {{ $t('moreFeedback') }}
      </span>
      <textarea
        v-model="feedback"
        name="searchFeedback__feedback"
        class="searchFeedback__feedback"
        id="searchFeedback__feedback"
        rows="5"
      />
    </label>
    <button
      class="pose__button"
      @click="sendFeedback()"
      :disabled="!isThumbDown && !isThumbUp"
      v-if="isThumbDown || isThumbUp"
    >
      {{ $t('feedbackButton') }}
    </button>
  </aside>
  <fwjs-message v-if="sentOk" category="success">
    {{ $t('successMessage1') }}
    <strong>{{ $t('successMessage2') }}</strong>
  </fwjs-message>
  <fwjs-message v-if="hasError" category="danger">
    {{ $t('errorMessage1') }}
    <strong>{{ $t('errorMessage2') }}</strong>
  </fwjs-message>
</template>

<script lang="ts">
  import browserUserData from '../services/BrowserUserData';
  import { defineComponent } from 'vue';
  import feedbackApi from '../api/feedback.api';
  import fwjsMessage from '@/app/shared/components/fwjsMessage.vue';
  import { percentageIsGreater } from '@/app/shared/utils/utils';

  const viewPercentage = 20;

  export default defineComponent({
    name: 'searchFeedback',
    data() {
      return {
        feedback: '',
        value: 0,
        sentOk: false,
        hasError: false,
      };
    },
    components: {
      fwjsMessage,
    },
    computed: {
      shouldShow() {
        const hasUpdatedData = this.hasError || this.sentOk;
        return percentageIsGreater(viewPercentage) && !hasUpdatedData;
      },
      isThumbUp() {
        return this.value > 0 ? 'isThumbUp' : '';
      },
      isThumbDown() {
        return this.value < 0 ? 'isThumbDown' : '';
      },
    },
    methods: {
      thumbUp() {
        this.value = this.value === 1 ? 0 : 1;
      },
      thumbDown() {
        this.value = this.value === -1 ? 0 : -1;
      },
      async sendFeedback() {
        try {
          const { roles, userAgent } = browserUserData(navigator, window);
          this.sentOk = (await feedbackApi.sendFeedback({
            ratingTool: 'searchFeedback',
            ratingComment: '',
            ratingValue: this.feedback,
            ratingProperties: {
              relations: roles,
              platform: userAgent,
            },
          })) as unknown as boolean;
        } catch (_error) {
          this.hasError = true;
        }
      },
    },
  });
</script>

<style lang="scss" scoped>
  .searchFeedback {
    &__title {
      border-bottom: 1px solid var(--border-color);
      font-family: var(--font-family);
      font-weight: 600;
      font-size: 1rem;
      margin: 1rem 0 1rem 0;
      padding: 0 0 0.5rem 0;
    }
    &__subtitle {
      font-family: var(--font-family);
      font-weight: 600;
      font-size: 1rem;
      display: block;
      margin: 1rem 0 0.5rem 0;
      padding: 0 0 0;
    }
    &__thumb {
      font-size: 3rem;
    }
    &__feedback {
      border-radius: var(--card-border-radius);
      border: 1px solid var(--border-color);
      display: block;
      padding: 0.5rem;
      margin: 0 0 1rem 0;
      width: 100%;
    }
    &__thumbContainer {
      text-align: center;
      max-width: 80%;
      margin: 0 auto 1rem auto;
      display: flex;
      justify-content: space-around;
      @media (min-width: $screen-sm-min) {
        margin: 0 0 1rem 0;
        max-width: 30%;
        text-align: left;
      }
    }
    &__thumb {
      aspect-ratio: 1/1;
      border-radius: var(--card-border-radius);
      cursor: pointer;
      display: block;
      opacity: 0.5;
      padding: 0.25rem;
      width: 5rem;
      text-align: center;

      &:hover,
      &.isThumbUp,
      &.isThumbDown {
        opacity: 1;
        background-color: var(--privatebgcolor);
        box-shadow: var(--shadowLevel-1);
        border: 1px solid var(--border-color);
        width: calc(5rem - 2px);
      }
      .fa-thumbs-down {
        color: var(--message-color-error);
      }
      .fa-thumbs-up {
        color: var(--message-color-success);
      }
    }
  }
</style>
