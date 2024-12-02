import { type Ref, computed, ref } from 'vue';
import { defineStore } from 'pinia';
import { useAuthStore } from '@/app/auth/store/auth';
import userApi from '../user.api';

export interface UserExtension {
  extNumero?: string;
  extExtension?: string;
  extDesc?: string;
  extEsMovil?: string;
  extPrincipal?: string;
  extRpt?: string;
}

export interface UserLocations {
  espacioTipo?: string;
  espacioTipoNombre?: string;
  espacioCodigo?: string;
  espacioNombre?: string;
  bloque?: string;
  planta?: string;
  plantaNombre?: string;
  dependencia?: string;
  dependenciaNombre?: string;
  codigoPatrimonial?: string;
  extensiones?: UserExtension[];
}

export interface Afiliacion {
  apellido1: string;
  apellido2: string;
  centros: string[];
  direccion: {
    via: string;
    domicilio: string;
    numero?: number;
    ampliacion: string;
    codigoPostal: string;
  };
  emailNotificaciones: string;
  emails: string[];
  fechaNacimiento: string;
  identificador: string;
  letra: string;
  nacionalidad: string;
  nombre: string;
  sexo: string;
  telefonoNotificaciones: string;
  telefonos: string[];
  tipoIdentificador: string;
}

export interface UserWhoamiUserDataDTO {
  afiliacion: Afiliacion;
  identificador: string;
  letra: string;
  tipoIdentificador: string;
  nombre: string;
  apellido1: string;
  dni: string;
  email: string;
  extensionsLocations: Array<{ [key: string]: string }>;
  isAdmin?: boolean;
  newUser: string;
  profile: string[];
  roleName: {
    description: string[];
    type: string[];
  };
  unitDescriptions: string[];
  unitsByUser: string[];
  uuid: string;
}

export const useUserStore = defineStore('user', () => {
  const user: Ref<UserWhoamiUserDataDTO | null> = ref(null);
  // Mutaciones
  const setUserMutation = (userData: UserWhoamiUserDataDTO): void => {
    user.value = userData;
    window.sessionStorage.setItem('p15s-roles', JSON.stringify(user.value.roleName));
    window.localStorage.setItem('p15s-useruuid', btoa(user.value.email));
  };
  // Acciones
  const setUser = () => {
    userApi
      .whoAmI()
      .then((response) => response.data)
      .then((user) => {
        setUserMutation(user);
        useAuthStore().setAdmin(user.isAdmin && user.isAdmin === true);
      });
  };
  // Getters
  const hasRoles = computed(() => (user.value !== null ? user.value.roleName : []));
  const isAdmin: Ref<boolean> = computed(() => user.value?.isAdmin === true);
  const isNewUser: Ref<boolean> = computed(
    () => (user.value && user.value.newUser && user.value.newUser === '1') || false,
  );
  const userIsLoaded: Ref<boolean> = computed(() => user.value !== null);
  return {
    user,
    // Acciones
    setUser,
    // Getters
    hasRoles,
    isAdmin,
    isNewUser,
    userIsLoaded,
  };
});
