<template>
  <section class="privatePage__container">
    <ProfilePageNavigation :title="$t('profile')" />
    <article class="privatePage">
      <ol class="breadcrumbs">
        <li class="breadcrumbs__item">
          <router-link to="/">
            {{ $t('micampus') }}
          </router-link>
        </li>
        <li class="breadcrumbs__item">{{ $t('profile') }}: {{ $t('personalData') }}</li>
      </ol>
      <h1 class="privatePage__title">
        {{ $t('personalData') }}
      </h1>
      <div class="panel privatePage__changePhoto" v-if="user">
        <div class="panel-space panel-bottom panel-top">
          <ul class="profileData">
            <li class="profileData__item">
              <strong class="profileData__label">Nombre completo</strong>
              <span class="profileData__value">{{ userCompleteName }}</span>
            </li>
            <li class="profileData__item">
              <strong class="profileData__label">{{ $t('relation') }}</strong>
              <span class="profileData__value">{{ userRoleName }}</span>
            </li>
            <li class="profileData__item">
              <strong class="profileData__label">{{ $t('officialEmail') }}</strong>
              <span class="profileData__value">
                <a :href="`mailto:${user.email}`">{{ user.email }}</a>
              </span>
            </li>
          </ul>
          <div v-if="hasExtensions">
            <strong class="profileData__label" v-if="user.extensionsLocations.length > 1">
              {{ $t('phones') }}:
            </strong>
            <strong class="profileData__label" v-else-if="user.extensionsLocations.length === 1">
              {{ $t('phone') }}:
            </strong>
            <div v-for="(loc, index) in user.extensionsLocations" :key="index">
              <p>
                <i class="fa-solid fa-location-dot"></i>
                {{ loc.espacioNombre }} {{ loc.plantaNombre }}
                <strong>{{ loc.codigoPatrimonial }}</strong> - {{ loc.dependenciaNombre }}
                <span v-if="loc.extensiones">
                  <span
                    v-for="phone in loc.extensiones"
                    :key="phone.extNumero"
                    class="profileData__phoneNumber"
                    :class="phone.extPrincipal === 'S' ? 'is-principal' : ''"
                  >
                    <i class="fal fa-phone" />&nbsp;
                    <a :href="`tel:${phone.extNumero}`">{{ phone.extNumero }}</a>
                    /&nbsp;
                    <a :href="`tel:${phone.extNumero}`">{{ phone.extExtension }}</a>
                  </span>
                </span>
              </p>
            </div>
          </div>
        </div>
        <div class="right">
          <a
            v-if="user.extensionsLocations.length > 0"
            href="https://telefonia.um.es"
            class="pose__button btn-sm button__secondary"
          >
            <i class="fal fa-phone" /> {{ $t('phoneLink') }}
          </a>
          <a
            v-if="isPasPdi"
            href="https://rrhh.um.es/rrhh2/paginas/datospersonales/home.seam"
            class="pose__button btn-sm"
          >
            <i class="fal fa-user" /> {{ $t('update') }}
          </a>
        </div>
      </div>
    </article>
  </section>
</template>

<script setup lang="ts">
  import { computed, onBeforeUnmount, onMounted } from 'vue';
  import ProfilePageNavigation from '../components/Profile/ProfilePageNavigation.vue';
  import { storeToRefs } from 'pinia';
  import { useI18n } from 'vue-i18n';
  import { usePageStore } from '@/app/shared/store/pages';
  import { useRoleComposable } from '../composables/useRoleComposable';
  import { useUserStore } from '../store/user';

  const { t } = useI18n();

  const { user } = storeToRefs(useUserStore());
  const { isPasPdi } = useRoleComposable();

  const userCompleteName = computed(() => {
    if (!user.value || !user.value.afiliacion) {
      return '';
    }
    const { nombre, apellido1, apellido2 } = user.value.afiliacion;
    return `${nombre} ${apellido1} ${apellido2}`;
  });

  const userRoleName = computed(() => {
    return user.value ? user.value.roleName.description.join(' | ') : '';
  });

  const hasExtensions = computed(() => {
    return user.value?.extensionsLocations && user.value?.extensionsLocations.length > 0;
  });

  onMounted(() => {
    usePageStore().setTitle(t('profile'));
    document.body.classList.toggle('with-menu');
  });

  onBeforeUnmount(() => {
    document.body.classList.toggle('with-menu');
  });
</script>

<style lang="scss" src="../assets/_profilePreferences.scss" />
