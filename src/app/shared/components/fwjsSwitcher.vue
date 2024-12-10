<template>
  <span class="switcher">
    <input
      type="checkbox"
      :id="`switch_${id}`"
      :checked="switchEstate"
      @change="changeSwitcher"
    /><label
      :for="`switch_${id}`"
      tabindex="0"
      @keyup.enter="changeSwitcher"
      @keyup.space="changeSwitcher"
      >{{ $t('title') }}</label
    >
  </span>
</template>

<script lang="ts">
  import { defineComponent } from 'vue';

  export default defineComponent({
    name: 'FwjsSwitcher',
    emits: ['changeSwitcher'],
    data() {
      return {
        id: 0,
      };
    },
    props: {
      switchEstate: { type: Boolean, required: true },
    },
    methods: {
      changeSwitcher() {
        this.$emit('changeSwitcher', !this.switchEstate);
      },
    },
    mounted() {
      this.id = Math.floor(Math.random() * 1000);
    },
  });
</script>

<style lang="scss" scoped>
  .switcher {
    cursor: pointer;
    display: inline-block;
    input[type='checkbox'] {
      height: 0;
      width: 0;
      visibility: hidden;
      display: none;
    }

    label {
      cursor: pointer;
      text-indent: -9999px;
      width: 2rem;
      height: 1rem;
      // background: #afb2b4;
      display: block;
      border-radius: 1rem;
      position: relative;
    }

    label::before {
      position: absolute;
      content: '';
      z-index: 1;
      top: 50%;
      left: 0;
      display: block;
      right: 0;
      background: rgb(222, 227, 230);
      transform: translateY(-50%);
      height: 0.7rem;
      border-radius: 0.6rem;
      transition: background-color 0.25s linear;
    }

    label::after {
      content: '';
      position: absolute;
      top: 0rem;
      left: 0rem;
      width: 1rem;
      height: 1rem;
      background: #a6aeb5;
      border-radius: 0.9rem;
      transition: 0.3s;
      z-index: 2;
      transition: all 0.15s linear;
    }

    input:checked + label {
      // background: var(--main-color);
      &::before {
        background: rgb(243, 203, 205);
      }
      &::after {
        background: var(--main-color);
      }
    }

    input:checked + label:after {
      left: calc(100% - 0.05rem);
      transform: translateX(-100%);
    }

    label:active:after {
      width: 1.1rem;
    }
  }
</style>
