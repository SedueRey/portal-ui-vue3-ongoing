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
                  v-if="imgURL"
                  :src="imgURL"
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
          <div>
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
                <ToggleSwitch
                  v-if="visiblePhoto !== null"
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
          <div class="panel-space panel-dark fuente08">
            <strong>{{ $t('txtPhotoRequirementsTitle') }}</strong>
            <ul>
              <li>{{ $t('txtPhotoRequirements1') }}</li>
              <li>{{ $t('txtPhotoRequirements2') }}</li>
            </ul>
          </div>
        </div>
        <div class="grid panel-space panel-bottom">
          <div class="col-12 lg:col-4 fuente08 divCentrado">
            {{ $t('txtHowToChangePhoto') }}
          </div>
          <div class="col-12 lg:col-4 divCentrado">
            <a
              href="https://administracionsv.um.es/tui/paginas/mantenimientos/fotomaton.seam"
              class="pose__button buttonModPhoto"
              target="_blank"
            >
              <em class="fa-light fa-camera"></em>{{ $t('makePhoto') }}
            </a>
          </div>
          <div class="col-12 lg:col-4 divCentrado">
            <FileUpload
              ref="fileupload"
              :title="$t('uploadPhoto')"
              mode="basic"
              accept=".jpg, .jpeg, .png"
              :maxFileSize="100000"
              :auto="true"
              :invalidFileSizeMessage="$t('uploadPhotoTooBig')"
              :invalidFileTypeMessage="$t('uploadPhotoInvalidFileType')"
              :customUpload="true"
              @uploader="customBase64Uploader"
              :chooseLabel="$t('uploadPhoto')"
            />
          </div>
        </div>
      </div>
    </article>
  </section>
</template>

<script setup lang="ts">
  import { computed, onBeforeUnmount, onMounted, ref, type Ref } from 'vue';
  import FileUpload from 'primevue/fileupload';
  import ProfilePageNavigation from '../components/Profile/ProfilePageNavigation.vue';
  import { storeToRefs } from 'pinia';
  import Toast from 'primevue/toast';
  import ToggleSwitch from 'primevue/toggleswitch';
  import { useAuthStore } from '@/app/auth/store/auth';
  import { useI18n } from 'vue-i18n';
  import { usePageStore } from '@/app/shared/store/pages';
  import userApi from '../api/user.api';
  import { useToast } from 'primevue/usetoast';

  const { t } = useI18n();
  const toast = useToast();
  const { token } = storeToRefs(useAuthStore());

  const visiblePhoto: Ref<boolean | null> = ref(null);
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

  const customBase64Uploader = (event) => {
    const file = event.files[0];
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result && typeof e.target.result === 'string') {
        const base64String = e.target.result.replace(/^data:(.*?);base64,/, '');
        userApi
          .setUserPhoto(base64String)
          .then(() => {
            toast.add({
              severity: 'success',
              summary: t('uploadPhotoOk'),
              detail: t('uploadPhotoOkDetails'),
              life: 6000,
            });
          })
          .catch(() => {
            toast.add({
              severity: 'error',
              summary: t('uploadPhotoError'),
              detail: t('uploadPhotoErrorDetails'),
              life: 6000,
            });
          });
      }
    };
    reader.readAsDataURL(file);
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
