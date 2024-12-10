<template>
  <section class="privatePage__container">
    <PreferencesPageNavigation :title="$t('preferences')" />
    <article class="privatePage">
      <ol class="breadcrumbs">
        <li class="breadcrumbs__item">
          <router-link to="/">
            {{ $t('home') }}
          </router-link>
        </li>
        <li class="breadcrumbs__item">{{ $t('preferences') }}: {{ $t('sliders') }}</li>
      </ol>
      <h1 class="privatePage__title">
        {{ $t('notifications') }}
      </h1>
      <p class="privatePage__subtitle">
        {{ $t('helpNotifications') }}
      </p>
      <fwjsMessage v-if="error" :text="$t('available')" category="danger" />
      <Tabs value="0">
        <TabList>
          <Tab value="0">{{ $t('general') }}</Tab>
          <Tab value="1">{{ $t('personal') }}</Tab>
        </TabList>
        <TabPanels>
          <TabPanel value="0" :header="$t('general')">
            <p class="tabs__help">
              {{ $t('generalNotifications') }}
            </p>
            <span
              class="pose__button button__secondary btn-sm"
              tabindex="0"
              @click="showAll('general', true)"
              @keyup.enter="showAll('general', true)"
              @keyup.space="showAll('general', true)"
              role="button"
            >
              {{ $t('showAll') }}
            </span>
            <span
              class="pose__button button__secondary btn-sm"
              tabindex="0"
              @click="showAll('general', false)"
              @keyup.enter="showAll('general', false)"
              @keyup.space="showAll('general', false)"
              role="button"
            >
              {{ $t('showNone') }}
            </span>
            <ul class="listItemSwitcher__list">
              <li v-for="noti in config" :key="noti.codigo" class="listItemSwitcher__itemContainer">
                <div class="listItemSwitcher__item no-pointer">
                  <span v-if="iconName(noti.nombre) !== ''">
                    <img
                      :src="`/img/notimovil/${iconName(noti.nombre)}.svg`"
                      :alt="noti.nombre"
                      role="presentation"
                    />
                  </span>
                  <span class="listItemSwitcher__label">
                    {{ noti.nombre }}<br />
                    <span class="listItemSwitcher__labelDesc">
                      {{ noti.descripcion }}
                    </span>
                  </span>
                  <fwjs-switcher
                    :switch-estate="noti.general"
                    @changeSwitcher="checkedClick(noti.codigo, 'general', noti.general)"
                  />
                </div>
              </li>
            </ul>
          </TabPanel>
          <TabPanel value="1" :header="$t('personal')">
            <p class="tabs__help">
              {{ $t('personalNotifications') }}
            </p>
            <span
              class="pose__button button__secondary btn-sm"
              tabindex="0"
              @click="showAll('personal', true)"
              @keyup.enter="showAll('personal', true)"
              @keyup.space="showAll('personal', true)"
              role="button"
            >
              {{ $t('showAll') }}
            </span>
            <span
              class="pose__button button__secondary btn-sm"
              tabindex="0"
              @click="showAll('personal', false)"
              @keyup.enter="showAll('personal', false)"
              @keyup.space="showAll('personal', false)"
              role="button"
            >
              {{ $t('showNone') }}
            </span>
            <ul class="listItemSwitcher__list">
              <li v-for="noti in config" :key="noti.codigo" class="listItemSwitcher__itemContainer">
                <div class="listItemSwitcher__item no-pointer">
                  <span>
                    <img
                      :src="`/img/notimovil/${iconName(noti.nombre)}.svg`"
                      :alt="noti.nombre"
                      role="presentation"
                    />
                  </span>
                  <span class="listItemSwitcher__label">
                    {{ noti.nombre }}<br />
                    <span class="listItemSwitcher__labelDesc">
                      {{ noti.descripcion }}
                    </span>
                  </span>
                  <fwjs-switcher
                    :switch-estate="noti.personal"
                    @changeSwitcher="checkedClick(noti.codigo, 'personal', noti.personal)"
                  />
                </div>
              </li>
            </ul>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </article>
  </section>
</template>

<script setup lang="ts">
  import { type Ref, onBeforeUnmount, onMounted, ref } from 'vue';
  import { type NotiMovilNotificacionResponse } from '../api/user.contracts';
  import PreferencesPageNavigation from '../components/Preferences/PreferencesPageNavigation.vue';
  import Tab from 'primevue/tab';
  import TabList from 'primevue/tablist';
  import TabPanel from 'primevue/tabpanel';
  import TabPanels from 'primevue/tabpanels';
  import Tabs from 'primevue/tabs';

  import fwjsMessage from '@/app/shared/components/fwjsMessage.vue';
  import fwjsSwitcher from '@/app/shared/components/fwjsSwitcher.vue';
  import userApi from '../api/user.api';

  const config: Ref<NotiMovilNotificacionResponse[]> = ref([]);
  const error = ref('');

  const showAll = (type, value = true) => {
    if (config.value) {
      config.value.forEach((el) => {
        if (el[type] !== value) {
          checkedClick(el.codigo, type, !value);
        }
      });
    }
  };

  const checkedClick = (id, type, value) => {
    const newObject = {};
    newObject[type] = !value;
    const newConfig = config.value.map((el) => (el.codigo !== id ? el : { ...el, ...newObject }));
    config.value = newConfig;
    const item = config.value.find((el) => el.codigo === id);
    if (!!item) {
      const sendData = [
        {
          codigo: item.codigo,
          general: item.general,
          personal: item.personal,
        },
      ];
      userApi.setConfigNotifications(sendData).catch((err) => {
        error.value = err.message;
      });
    }
  };

  const iconName = (text) => {
    return typeof text.normalize !== 'undefined'
      ? text
          .normalize('NFD')
          .replace(/\p{Diacritic}/gu, '')
          .toLowerCase()
          .replaceAll(' ', '_')
      : '';
  };

  onMounted(async () => {
    document.body.classList.toggle('with-menu');
    await userApi
      .getConfigNotifications()
      .then((response) => response.data)
      .then((configuration) => {
        config.value = configuration.sort((a, b) => a.nombre.localeCompare(b.nombre));
      })
      .catch((err) => {
        error.value = err.message;
      });
  });

  onBeforeUnmount(() => {
    document.body.classList.toggle('with-menu');
  });
</script>

<style lang="scss" src="../assets/_profilePreferences.scss" />
