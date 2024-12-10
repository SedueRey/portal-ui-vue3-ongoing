<template>
  <a class="fwjswidgetitem" :class="getClass" :href="service.url" tabindex="0" v-if="service">
    <span class="fwjswidgetitem__icon">
      <i class="fa" :class="service.icon" />
    </span>
    <span class="fwjswidgetitem__name">{{ service.name }}</span>
  </a>
</template>

<script setup lang="ts">
  import { type WidgetService } from '../shared.types';
  import { computed } from 'vue';

  const props = defineProps<{
    service: WidgetService;
  }>();

  const getClass = computed(() => {
    const classItem = !props.service.category[0] ? '0' : props.service.category[0];
    const serviceId = !props.service.id ? '' : props.service.id;
    return `fwjswidgetitem__link__cat${classItem} fwjswidgetitem__link__${serviceId} `;
  });
</script>

<style lang="scss">
  .fwjswidgetitem {
    align-items: center;
    color: #212121;
    cursor: pointer;
    display: flex;
    flex-direction: row;
    font-family: 'Inter', sans-serif;
    margin: 0;
    padding: 0.6rem 0 0.6rem 0.25rem;
    text-decoration: none;
    &:hover {
      background-color: #f2f5f7;
    }
    a {
      color: #212121;
    }
    &__icon {
      background-color: #fff;
      box-shadow:
        0 1px 8px 0 rgba(0, 0, 0, 0.1),
        0 3px 4px 0 rgba(0, 0, 0, 0.12),
        0 3px 3px -2px rgba(0, 0, 0, 0.15);
      display: block;
      transition: all 0.5s ease;
      width: 24px;
      min-width: 24px;
      height: 24px;
      min-height: 24px;
      border-radius: 24px;
      font-size: 14px;
      line-height: 1;
      overflow: hidden;
      margin: 0 1rem 0 1rem;
      line-height: 1;
      padding: 2px;
      position: relative;
      i {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
      }
    }
    &__name {
      display: block;
    }
    &__link__cat0 .fwjswidgetitem__icon {
      color: var(--category0-color);
    }
    &__link__cat1 .fwjswidgetitem__icon {
      color: var(--category1-color);
    }
    &__link__cat2 .fwjswidgetitem__icon {
      color: var(--category2-color);
    }
    &__link__cat3 .fwjswidgetitem__icon {
      color: var(--category3-color);
    }
    &__link__cat4 .fwjswidgetitem__icon {
      color: var(--category4-color);
    }
    &__link__cat5 .fwjswidgetitem__icon {
      color: var(--category5-color);
    }
  }
</style>
