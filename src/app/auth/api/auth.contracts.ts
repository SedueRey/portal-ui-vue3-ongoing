export interface JWTStructure {
  aud: string;
  auth_type: string;
  authenticationMethod: string[];
  exp: number;
  grant_type: string;
  iat: number;
  isFromTrustedMultifactorAuthentication: 'true' | 'false';
  iss: string;
  original_subject: string;
  scope: string;
  sub: string;
  userAgent: string;
}

export interface JWTLoginError {
  code: string;
  info: string;
}
