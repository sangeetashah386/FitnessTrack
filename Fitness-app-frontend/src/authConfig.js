

export const authConfig = {
    clientId: 'oauth2-pkce-client',
    authorizationEndpoint: 'https://auth.fitnesstrackapp.click/realms/fitness-oauth2/protocol/openid-connect/auth',
    tokenEndpoint: 'https://auth.fitnesstrackapp.click/realms/fitness-oauth2/protocol/openid-connect/token',
    userinfoEndpoint: "https://auth.fitnesstrackapp.click/realms/fitness-oauth2/protocol/openid-connect/userinfo",
    redirectUri: 'https://fitnesstrackapp.click',
    scope: 'openid profile email offline_access phone',
    loadUserInfo: true,
    pkce: true,
    autoLogin: false,
    onRefreshTokenExpire: (event) => event.logIn(),
  }