import authCrypto from '../utils/crypto';
import axios from 'axios';
import navigateTo from '../utils/navigateTo';

const endpoints = {
  logout: `${window._env_.SSO_URL}/cas/logout`,
  login: `${window._env_.SSO_URL}/cas/oidc/authorize`,
  token: `${window._env_.SSO_URL}/cas/oidc/accessToken`,
  cas: `${window._env_.SSO_URL}`,
  originalPath: `${window.location.protocol}//${window.location.host}`,
};

const authApi = {
  endpoints: () => endpoints,
  login: async (loamedium = false) => {
    const clientId = loamedium ? 'loaummedium' : 'webservice';
    const state = authCrypto.generateRandomString();
    window.sessionStorage.setItem('pkce_state', state);
    const codeVerifier = await authCrypto.generateRandomString();
    window.sessionStorage.setItem('pkce_code_verifier', codeVerifier);
    const codeChallenge = await authCrypto.pkceChallengeFromVerifier(codeVerifier);
    const originalpath = endpoints.originalPath;
    const url = `${
      endpoints.login
    }?response_type=code&client_id=${clientId}&state=${encodeURIComponent(
      state,
    )}&scope=micampus&redirect_uri=${encodeURIComponent(
      `${originalpath}/#/login/`,
    )}&code_challenge=${encodeURIComponent(codeChallenge)}&code_challenge_method=S256`;
    navigateTo(url);
  },
  getToken: (code, loamedium) => {
    const clientId = loamedium ? 'loaummedium' : 'webservice';
    const data = new FormData();
    data.append('grant_type', 'authorization_code');
    data.append('code', code);
    data.append('client_id', clientId);
    data.append('redirect_uri', endpoints.originalPath);
    const codeVerifier = window.sessionStorage.getItem('pkce_code_verifier');
    if (!!codeVerifier) {
      data.append('code_verifier', codeVerifier);
      return axios({
        method: 'POST',
        url: endpoints.token,
        data: new URLSearchParams(data.entries() as unknown as string[][]),
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      });
    }
  },
};

export default authApi;
