const mainRoles = JSON.parse(sessionStorage.getItem('p15s-roles') || '');
let roles = '';
try {
  roles = mainRoles ? mainRoles.type.join(',') : '';
} catch (_err) {
  roles = 'EXT';
}

const browserUserData = (navigator, window) => ({
  userAgent: navigator?.userAgent || 'not-available',
  app: navigator?.appCodeName || 'not-available',
  appName: navigator?.appName || 'not-available',
  languages: navigator?.languages || 'not-available',
  oscpu: navigator?.oscpu || 'not-available',
  pdfViewerEnabled: navigator?.pdfViewerEnabled || 'not-available',
  platform: navigator?.platform || 'not-available',
  hardwareConcurrency: navigator?.hardwareConcurrency || 'not-available',
  isMobile: window?.innerWidth ? window.innerWidth < 600 : 'not-available',
  roles,
});

export default browserUserData;
