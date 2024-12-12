<template>
  <span class="notificationItem" v-if="notification && id">
    <span :class="id === 'hidden' ? 'is-disabled' : ''" :event="id !== 'hidden' ? 'click' : ''">
      <h4 class="notificationItem__menuTitle">
        {{ notification.titulo }}
      </h4>
      <time class="notificationItem__menuTime" :datetime="notification.fecha_envio">
        {{ notification.fecha_envio }}
      </time>
      <p class="notificationItem__description" :class="collapsed ? 'is-collapsed' : ''">
        <span class="notificationItem__descriptiontext" v-html="descripcionWithLinks" />
        <span v-if="!isURLLink">
          {{ notification.referencia_web }}
        </span>
      </p>
    </span>
    <a
      v-if="isURLLink"
      :href="notification.referencia_web"
      class="notificationItem__link"
      :class="classLink"
      target="_blank"
    >
      <i class="fal fa-link" /> {{ $t('weblink') }}
    </a>
    <span
      class="notificationItem__more"
      v-if="collapsed && shouldCollapse"
      @click="toggleCollapsable"
      @click.stop
      @click.prevent
    >
      [+]
    </span>
    <span
      class="notificationItem__more"
      v-if="!collapsed && shouldCollapse"
      @click="toggleCollapsable"
      @click.stop
      @click.prevent
    >
      [-]
    </span>
  </span>
</template>

<script lang="ts">
  import { defineComponent } from 'vue';
  import { linkify } from '../utils/utils';

  export default defineComponent({
    name: 'NotificationItem',
    props: {
      notification: { type: Object, required: true },
      id: { type: String, required: true },
    },
    data() {
      return {
        collapsed: true,
      };
    },
    computed: {
      shouldCollapse() {
        return this.notification.descripcion.length > 70;
      },
      classLink() {
        return this.shouldCollapse ? 'is-collapsable' : '';
      },
      isURLLink() {
        return this.notification.referencia_web
          ? this.notification.referencia_web.match(
              /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_+.~#?&//=]*)/g,
            )
          : false;
      },
      descripcionWithLinks() {
        return linkify(this.notification.descripcion);
      },
    },
    methods: {
      toggleCollapsable() {
        this.collapsed = !this.collapsed;
      },
    },
  });
</script>

<style lang="scss">
  .notificationItem {
    a {
      color: inherit;
      display: block;
      text-decoration: none;
      &:hover {
        color: inherit;
        text-decoration: none;
        transform: scale(1.01);
        transition: transform 0.1s linear;
      }
      &.is-disabled {
        cursor: auto;
        &:hover {
          transform: scale(1);
          transition: transform 0s linear;
        }
      }
      &.notificationItem__link {
        color: var(--link-color);
        cursor: pointer;
        position: absolute;
        text-decoration: underline;
        &:hover {
          text-decoration: none;
        }
      }
      &.notificationItem__link.is-collapsable {
        left: 2.5rem;
        padding: 0.15rem 0 0 0;
      }
    }
    &__description {
      display: -webkit-box;
      line-height: 1.15;
      -webkit-box-orient: vertical;
      overflow: hidden;
      text-overflow: ellipsis;
      width: 100%;
      font-size: 0.85rem;
      &.is-collapsed {
        -webkit-line-clamp: 2;
        line-clamp: 2;
      }
    }
    &__menuTitle {
      font-size: 1rem;
      font-weight: 400;
      line-height: 1.15;
      margin: 0 0 0.5rem 0;
      padding: 0 0 0 0;
    }
    &__menuTime {
      display: block;
      font-size: 0.7rem;
      margin: 0 0 0.25rem 0;
    }
    &__more {
      color: var(--link-color);
      cursor: pointer;
      display: block;
      position: absolute;
      text-align: right;
      bottom: 0.5rem;
      left: 1rem;
    }
  }
</style>
