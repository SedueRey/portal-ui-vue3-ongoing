<template>
  <form @submit.prevent="onSubmit">
    <div class="headerSearch" :class="getClass">
      <AutoComplete
        v-model="searchQuery"
        :suggestions="suggestions"
        @complete="search($event)"
        @item-select="onSubmit"
        ref="autocomplete"
      />
    </div>
  </form>
</template>

<script lang="ts">
  import AutoComplete from 'primevue/autocomplete';
  import { defineComponent } from 'vue';
  import poseApi from '../api/pose.api';

  export default defineComponent({
    name: 'HeaderSearch',
    props: {
      hasBg: { type: Boolean, required: false, default: true },
      inputData: { type: String, required: false, default: '' },
    },
    components: {
      AutoComplete,
    },
    data() {
      return {
        active: false,
        searchQuery: '',
        suggestions: [],
      };
    },
    computed: {
      getClass() {
        let className = '';
        className += this.active ? 'headerSearch__active ' : '';
        className += this.hasBg ? 'headerSearch__has-background ' : '';
        return className;
      },
      hasSuggestions() {
        return this.suggestions && this.suggestions.length > 0;
      },
    },
    mounted() {
      if (this.inputData) {
        this.searchQuery = this.inputData;
      }
    },
    methods: {
      search(event) {
        this.searchData(event.query).then((response) => {
          this.suggestions = response;
        });
      },

      async searchData(input) {
        if (input.length < 3) {
          return [];
        }

        const response = await poseApi.getSuggestions(input);
        return response.data;
      },

      onSubmit() {
        if (this.searchQuery !== '') {
          this.$router
            .push({
              name: 'search',
              params: { tag: this.searchQuery },
            })
            .catch(() => {});
        }
      },
    },
  });
</script>

<style lang="scss">
  .headerSearch {
    background-color: var(--main-color-darker);
    border-radius: 3rem;
    box-shadow: inset 0px 0px 0 0px rgba(0, 0, 0, 0);
    padding: 4px 12px;
    position: relative;
    &__has-background {
      background-color: var(--main-color-darker);
      .p-autocomplete-input {
        color: #fff;
      }
    }
    &:not(&__has-background) {
      background-color: #fff;
      border: 0 none;
      .headerSearch__inputSearch {
        color: var(--main-text-color);
        background-color: #fff;
        &::placeholder {
          color: var(--main-text-footer);
        }
      }
    }
    > div {
      width: 100%;
    }
    @media (min-width: $screen-sm-min) {
      position: relative;
    }
    &__active {
      box-shadow: inset 0px 0px 6px 0px rgba(0, 0, 0, 0.15);
    }
    &__inputLabel {
      position: absolute;
      top: -500rem;
    }
    &__inputSearchContainer {
      width: 100%;
      > div {
        width: 100%;
      }
    }
  }

  .p-autocomplete {
    // display: flex;
    width: 100%;
  }

  .p-autocomplete .p-autocomplete-input {
    border: 0px none;
    box-sizing: border-box;
    color: var(--main-text-color);
    position: relative;
    font-size: 1rem;
    flex: 1;
    font-family: var(--font-family);
    background-color: transparent;
    background-image: url('/img/icons/looking-glass-grey.svg');
    background-repeat: no-repeat;
    background-position: 0 center;
    padding: 0.35rem 0 0.35rem 1.8rem;
    width: 100%;
  }

  .p-autocomplete .p-autocomplete-input:focus,
  .p-autocomplete .p-autocomplete-input:enabled:focus,
  .p-autocomplete .p-autocomplete-input[aria-expanded='true'] {
    outline: none;
    box-shadow: none;
  }

  [data-position='below'] .p-autocomplete-input[aria-expanded='true'] {
    border-bottom-color: transparent;
    border-radius: 8px 8px 0 0;
  }

  [data-position='above'] .p-autocomplete-input[aria-expanded='true'] {
    border-top-color: transparent;
    border-radius: 0 0 8px 8px;
    z-index: 2;
  }

  .p-autocomplete[data-loading='true']:after {
    content: '';
    border: 3px solid rgba(0, 0, 0, 0.12);
    border-right-color: rgba(0, 0, 0, 0.48);
    border-radius: 100%;
    width: 20px;
    height: 20px;
    position: absolute;
    right: 12px;
    top: 50%;
    transform: translateY(-50%);
    animation: rotate 1s linear infinite;
  }

  .p-autocomplete-panel {
    max-height: none !important;
    margin-top: 0.5rem;
    border-top-color: transparent;
    border-radius: 0.5rem;
  }

  .p-autocomplete-width-panel {
    width: 100%;
  }

  .p-autocomplete-items {
    background: #fff;
    border: 1px solid rgba(0, 0, 0, 0.12);
    box-shadow: 0 2px 2px rgba(0, 0, 0, 0.16);
    box-sizing: border-box;
    color: var(--main-text-color);
    cursor: pointer;
    list-style: none;
    margin: 0;
    max-height: 18rem;
    overflow-y: auto;
    padding: 0;
    text-align: left;
    width: 100%;
    z-index: 5 !important;
    &:empty {
      display: none;
    }
  }

  .p-autocomplete-panel .p-autocomplete-items .p-autocomplete-item {
    cursor: pointer;
    padding: 0.75rem;
    font-size: 0.875rem;
    width: 100%;
  }

  .p-autocomplete-item:hover,
  .p-autocomplete-item[aria-selected='true'] {
    background-color: rgba(0, 0, 0, 0.06);
  }

  @keyframes rotate {
    0% {
      transform: translateY(-50%) rotate(0deg);
    }

    to {
      transform: translateY(-50%) rotate(359deg);
    }
  }
</style>

<i18n>
{
  "en": {
    "search": "Search services"
  },
  "es": {
    "search": "¿Qué estás buscando?"
  }
}
</i18n>
