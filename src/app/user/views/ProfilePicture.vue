<template>
  <section class="privatePage__container">
    <ProfilePageNavigation :title="$t('profile')" />
    <article class="privatePage is-detail">
      <ol class="breadcrumbs">
        <li class="breadcrumbs__item">
          <router-link to="/">
            {{ $t('micampus') }}
          </router-link>
        </li>
        <li class="breadcrumbs__item">{{ $t('profile') }}: {{ $t('officialPhoto') }}</li>
      </ol>
      <Toast />
      <h1 class="privatePage__title">
        {{ $t('officialPhoto') }}
      </h1>
      <div class="panel privatePage__changePhoto">
        <div class="panel-space panel-top panel-columns">
          <div>
            <aside class="profile">
              <div class="profile__editPhoto">
                <img
                  v-auth-image="urlPhoto"
                  itemprop="image"
                  :alt="$t('miFoto')"
                  :title="$t('miFoto')"
                  class="profile__photo"
                />
              </div>
              <div v-if="visiblePhoto" class="profile__authicon">
                <em class="fa-light fa-eye" :title="$t('txtPhotoVisibleTitle')"></em>
              </div>
              <div v-else class="profile__authicon">
                <em class="fa-light fa-eye-slash" :title="$t('txtPhotoNoVisibleTitle')"></em>
              </div>
            </aside>
          </div>
          <div class="texto-foto-wrapper">
            <div class="grid">
              <div class="col-10">
                <strong v-if="visiblePhoto">
                  {{ $t('txtPhotoVisibleTitle') }}
                </strong>
                <strong v-else>
                  {{ $t('txtPhotoNoVisibleTitle') }}
                </strong>
                <br />
                <span v-if="visiblePhoto">
                  {{ $t('txtPhotoVisible') }}
                </span>
                <span v-if="!visiblePhoto && alumno">
                  {{ $t('txtPhotoNoVisibleAlumno') }}
                </span>
                <span v-if="!visiblePhoto && !alumno">
                  {{ $t('txtPhotoNoVisibleOtros') }}
                </span>
              </div>
              <div class="col-2 inputSwitchDiv" :title="$t('changePhotoVisibility')">
                <InputSwitch
                  v-model="visiblePhoto"
                  @click="changeVisibilityPhoto"
                  :title="$t('changePhotoVisibility')"
                  :aria-label="$t('changePhotoVisibility')"
                />
              </div>
            </div>
          </div>
        </div>
        <div class="divContainerRequeriments">
          <div class="panel-space panel-dark cuadro-requisitos">
            <strong>{{ $t('txtPhotoRequirementsTitle') }}</strong>
            <ul class="fa-ul">
              <li>
                <span class="fa-li"><i class="fa-solid fa-check"></i></span>
                {{ $t('txtPhotoRequirements1') }}
              </li>
              <li>
                <span class="fa-li"><i class="fa-solid fa-check"></i></span>
                {{ $t('txtPhotoRequirements2') }}
              </li>
              <li>
                <span class="fa-li"><i class="fa-solid fa-check"></i></span>
                {{ $t('txtPhotoRequirements3') }}
              </li>
            </ul>
          </div>
        </div>
        <div class="panel-space panel-bottom">
          <p class="panel-columns">
            <span>{{ $t('txtHowToChangePhoto') }}</span>
            <a
              href="https://administracionsv.um.es/tui/paginas/mantenimientos/fotomaton.seam"
              class="pose__button width-card no-margin"
              target="_blank"
            >
              <em class="fa-light fa-camera"></em> {{ $t('makePhoto') }}
            </a>
          </p>
        </div>
      </div>
    </article>
  </section>
</template>

<script setup lang="ts">
  import { computed, onBeforeUnmount, onMounted, ref, type Ref } from 'vue';
  import ProfilePageNavigation from '../components/Profile/ProfilePageNavigation.vue';
  import { storeToRefs } from 'pinia';
  import Toast from 'primevue/toast';
  import { useAuthStore } from '@/app/auth/store/auth';
  import { useI18n } from 'vue-i18n';
  import { usePageStore } from '@/app/shared/store/pages';
  import userApi from '../api/user.api';
  import { useToast } from 'primevue/usetoast';

  const { t } = useI18n();
  const toast = useToast();
  const { token } = storeToRefs(useAuthStore());

  const visiblePhoto: Ref<boolean> = ref(false);
  const alumno: Ref<boolean | null> = ref(null);
  const imgURL: Ref<string | undefined> = ref(undefined);

  const urlPhoto = computed(() => {
    const urls = userApi.endpoints();
    return `${urls.environmentURL}${urls.userPhoto}`;
  });

  const checkEsAlumno = () => {
    userApi
      .esAlumno()
      .then((response) => response.data)
      .then((data) => {
        alumno.value = JSON.parse(data);
      })
      .catch(() => {
        alumno.value = false;
      });
  };

  const getVisibilityPhoto = () => {
    userApi
      .getUserPhotoAuthorization()
      .then((response) => response.data)
      .then((data) => {
        visiblePhoto.value = data.response;
      })
      .catch(() => {
        visiblePhoto.value = false;
      });
  };

  const changeVisibilityPhoto = () => {
    userApi
      .setUserPhotoAuthorization(!visiblePhoto.value)
      .then()
      .catch(() => {
        visiblePhoto.value = !visiblePhoto.value;
        toast.add({
          severity: 'error',
          summary: t('changePhotoVisibilityError'),
          detail: t('changePhotoVisibilityErrorDetails'),
          life: 6000,
        });
      });
  };

  onMounted(() => {
    usePageStore().setTitle(t('profile'));
    document.body.classList.toggle('with-menu');
    if (token.value) {
      fetch(urlPhoto.value, {
        headers: {
          Authorization: `Bearer ${token.value}`,
        },
      })
        .then((resp) => resp.blob())
        .then((blob) => {
          const reader = new FileReader();
          reader.readAsDataURL(blob);
          reader.onloadend = function () {
            const base64data = reader.result;
            imgURL.value = base64data as string;
          };
        });
    }
    checkEsAlumno();
    getVisibilityPhoto();
  });

  onBeforeUnmount(() => {
    document.body.classList.toggle('with-menu');
  });
</script>

<style lang="scss" src="../assets/_profilePreferences.scss" />
