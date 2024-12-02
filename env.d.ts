/// <reference types="vite/client" />

interface Window {
  _env_: {
    API_UM_URL: string;
    POSE_API_URL: string;
    SSO_URL: string;
    isSafari: boolean;
  };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  JL: any;
}
