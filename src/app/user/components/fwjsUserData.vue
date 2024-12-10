<template>
  <div
    v-if="user"
    itemscope
    itemtype="http://schema.org/Person"
    class="fwjsUserData"
    :class="className"
  >
    <router-link to="/profile" class="fwjsUserData__link" :ariaLabel="$t('profileLink')">
      <figure class="fwjsUserData__photoContainer">
        <img
          v-if="urlPhoto"
          :src="urlPhoto"
          itemprop="image"
          :alt="userCompleteName"
          class="fwjsUserData__photo"
        />
      </figure>
    </router-link>
    <router-link to="/profile/data" class="fwjsUserData__link">
      <div class="fwjsUserData__whoami">
        <span itemprop="roleName" class="fwjsUserData__rol">
          {{ userRoleName }}
        </span>
        <span class="fwjsUserData__name">
          {{ userCompleteName }}
        </span>
        <span itemprop="email" class="fwjsUserData__email" :title="user.email">
          {{ user.email }}
        </span>
      </div>
    </router-link>
  </div>
</template>

<script lang="ts">
  import { defineComponent } from 'vue';

  export default defineComponent({
    name: 'FwjsUserData',
    props: {
      user: { type: Object, required: true },
      urlPhoto: { type: String, required: false, default: undefined },
      className: { type: String, required: false, default: '' },
    },
    computed: {
      userRoleName() {
        return this.user ? this.user.roleName.description.join(' | ') : '';
      },
      userCompleteName() {
        if (!this.user || !this.user.afiliacion) {
          return '';
        }
        const { nombre, apellido1, apellido2 } = this.user.afiliacion;
        return `${nombre} ${apellido1} ${apellido2}`;
      },
      userUnits() {
        return !this.user.unitDescriptions ? '' : this.user.unitDescriptions.join(' | ');
      },
    },
  });
</script>

<style lang="scss">
  :root {
    --avatar-size: 4rem;
    --text-color: #555555;
    --data-color: #767676;
  }
  .fwjsUserData {
    padding: 1rem 0 1rem 1rem;
    display: flex;
    flex-direction: row;
    align-items: center;
    border-bottom: 1px solid #d8dde1;
    &__photoContainer {
      border-radius: var(--avatar-size);
      height: var(--avatar-size);
      margin: 0 1rem 0 0;
      padding: 0 0 0 0;
      width: var(--avatar-size);
      overflow: hidden;
      flex-shrink: 0;
      img {
        width: var(--avatar-size);
        height: auto;
      }
    }
    &__link {
      text-decoration: none;
    }
    &__rol {
      color: var(--data-color);
      display: block;
      font-size: 0.75rem;
      margin-bottom: 0.25rem;
    }
    &__email {
      color: #006fe6;
      display: block;
      font-size: 0.875rem;
      margin-bottom: 0.25rem;
    }
    &__name {
      display: block;
      color: var(--text-color);
      font-size: 0.9rem;
      margin-bottom: 0.25rem;
    }
    &__service {
      color: var(--data-color);
      font-size: 0.875rem;
      display: block;
    }
  }
</style>
