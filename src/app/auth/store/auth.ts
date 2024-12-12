import { computed, ref, type Ref } from 'vue';
import type { JWTLoginError, JWTStructure } from '../auth.types';
import authApi from '../api/auth.api';
import authCrypto from '../utils/crypto';
import { defineStore } from 'pinia';
import { jwtDecode } from 'jwt-decode';
import navigateTo from '../utils/navigateTo';

const isLoaMedium = (tokenData) => {
  return (
    tokenData.authnContextClass?.startsWith('mfa-') ||
    (tokenData.clientName &&
      (tokenData.clientName === 'Cl@ve' || tokenData.clientName === 'Cl@veD')) ||
    false
  );
};

export const useAuthStore = defineStore('auth', () => {
  const isAdmin: Ref<boolean> = ref(false);
  const token: Ref<string | null | undefined> = ref(undefined);
  const tokenData: Ref<JWTStructure | undefined | null> = ref(undefined);
  const sessionID: Ref<string | null> = ref(null);
  const expires: Ref<number | null> = ref(null);
  const loginError: Ref<JWTLoginError | undefined> = ref(undefined);
  const needs2FA: Ref<boolean> = ref(false);
  const valid2FA: Ref<boolean> = ref(false);
  const cas: string = authApi.endpoints().cas;
  // Antiguas mutaciones
  const setToken = (ticket: string): void => {
    token.value = ticket;
    tokenData.value = jwtDecode(ticket);
    window.sessionStorage.setItem('accesstoken', token.value);
    if (tokenData.value) {
      expires.value = tokenData.value.exp * 1000;
      valid2FA.value = isLoaMedium(tokenData);
    }
    if (!sessionID.value) {
      sessionID.value = authCrypto.generateRandomString();
    }
    // Guardo si está logueado o no para pasarlo al resto
    // de módulos de la store y no realizar importaciones cíclicas
  };
  const setAdmin = (admin: boolean): void => {
    isAdmin.value = admin;
  };
  const revokeTokenMutation = (): void => {
    token.value = null;
    tokenData.value = null;
    expires.value = null;
    valid2FA.value = false;
    needs2FA.value = false;
    window.sessionStorage.removeItem('accesstoken');
    // Guardo si está logueado o no para pasarlo al resto
    // de módulos de la store y no realizar importaciones cíclicas
  };
  const setError = (error) => {
    loginError.value = error;
  };
  const set2faNeeded = (needs2FA) => {
    needs2FA.value = needs2FA;
  };
  // Acciones
  const login = async () => {
    window.sessionStorage.setItem('accesstokenlogin', 'token');
    await authApi.login();
  };
  const loginLoaMedium = async () => {
    await authApi.login(true);
  };
  const accessToken = async (code: string) => {
    const loaLoginRoutePath = window.localStorage.getItem('POSE_FORBIDDEN2FA_ROUTE_KEY') || '';
    if (loaLoginRoutePath) {
      window.localStorage.setItem('POSE_LOGIN_ROUTE_KEY', loaLoginRoutePath);
      window.localStorage.removeItem('POSE_FORBIDDEN2FA_ROUTE_KEY');
    }
    try {
      const response = await authApi.getToken(code, loaLoginRoutePath || false);
      if (response?.data) {
        const { data } = response;

        window.localStorage.removeItem('pkce_state');
        window.localStorage.removeItem('pkce_code_verifier');
        window.localStorage.removeItem('accesstokenlogin');
        setToken(data.access_token);
        set2faNeeded(false);
        let lastRoutePath = window.localStorage.getItem('POSE_LOGIN_ROUTE_KEY') || '';
        if (!lastRoutePath.includes('login')) {
          if (lastRoutePath.charAt(0) === '/') {
            lastRoutePath = lastRoutePath.slice(1);
          }
          window.localStorage.removeItem('POSE_LOGIN_ROUTE_KEY');
          const url = `${authApi.endpoints().originalPath}/#/${lastRoutePath}`;
          navigateTo(url);
        } else {
          navigateTo(authApi.endpoints().originalPath);
        }
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      if (error.response && error.response.status > 404) {
        // Ñapa error 423 CAS con Safari
        window.localStorage.setItem('accesstoken-fail', `CAS-${error.response.status}`);
        window.localStorage.removeItem('pkce_state');
        window.localStorage.removeItem('accesstokenlogin');
        window.localStorage.removeItem('pkce_code_verifier');
        revokeTokenMutation();
        setError({
          code: error.response.status,
          info: error.response?.data || '',
        });
        setTimeout(() => {
          window.location.reload();
        }, 2500);
      } else {
        navigateTo(authApi.endpoints().originalPath);
      }
    }
  };
  const revokeToken = () => {
    revokeTokenMutation();
    window.location.href = `${authApi.endpoints().logout}`;
  };
  // Getters
  const isLogged: Ref<boolean> = computed(() => !!token.value);
  const urlLogin: Ref<string> = computed(() => authApi.endpoints().login);
  return {
    isAdmin,
    token,
    tokenData,
    sessionID,
    expires,
    loginError,
    needs2FA,
    valid2FA,
    cas,
    // Mutaciones
    setToken,
    setAdmin,
    revokeTokenMutation,
    setError,
    set2faNeeded,
    // Acciones
    login,
    loginLoaMedium,
    accessToken,
    revokeToken,
    // Getters
    isLogged,
    urlLogin,
  };
});
