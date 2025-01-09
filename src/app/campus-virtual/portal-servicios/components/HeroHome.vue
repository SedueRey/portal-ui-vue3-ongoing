<template>
  <div class="hero__container">
    <section class="hero">
      <article class="hero__search">
        <h1 class="hero__title">{{ $t('welcome') }}</h1>
        <p class="hero__text">{{ $t('welcomeDesc') }}</p>
        <header-search :has-bg="false" class="hero__inputSearch" />
        <a href="https://www.um.es/web/atica/micampus" target="_blank" class="hero__helpText">
          {{ $t('link') }}
        </a>
      </article>
    </section>
  </div>
</template>

<script lang="ts">
  import { defineComponent } from 'vue';
  import HeaderSearch from './HeaderSearch.vue';

  export default defineComponent({
    name: 'HeroHome',
    data() {
      return {
        bgImage: '/img/foto-portada-login-0.jpg',
        bgMobileImage: '/img/foto-portada-mobile-login-0.jpg',
      };
    },
    components: {
      HeaderSearch,
    },
  });
</script>

<style lang="scss" scoped>
  .hero {
    background-image: url('/img/foto-portada-login-0.jpg');
    background-position: center center;
    background-color: var(--main-color);
    background-size: cover;
    background-repeat: no-repeat;
    border-radius: 0.5rem;
    color: #fff;
    position: relative;
    a {
      color: var(--highlight-color);
    }
    @media (max-width: $screen-xs-min) {
      background-image: url('/img/foto-portada-mobile-login-0.jpg');
      margin: 1rem 1rem 2rem 1rem;
      height: 0;
      padding-top: calc(80% - 1rem);
      box-sizing: content-box;
    }
    @media (min-width: $screen-xs-min) {
      height: 15rem;
    }
    &__container {
      padding: 0 0.25rem;
      max-width: var(--grid-width);
      margin: 2.5rem auto 2rem auto;
    }
    &__search {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      top: 20%;
      background-image: linear-gradient(to bottom, rgba(219, 239, 238, 0), var(--main-color) 43%);
      border-bottom-left-radius: 0.5rem;
      border-bottom-right-radius: 0.5rem;
      padding: 4rem 1rem 1rem 1rem;
      display: flex;
      flex-direction: column;
      justify-content: flex-end;
      @media (min-width: $screen-sm-min) {
        text-align: center;
      }
    }
    &__title {
      color: #fff;
      font-size: 1.5rem;
      margin: 0 0 0.25rem 0;
    }
    &__inputSearch {
      margin: 1.2rem auto 0 auto;
      width: 50%;
      @media (max-width: $screen-sm-min) {
        max-width: 100%;
        width: 100%;
      }
    }
    &__helpText {
      line-height: 1;
      margin: 1rem 0 0 0;
    }
  }
</style>
