import { describe, expect, it } from 'vitest';
import browserUserData from './BrowserUserData';

interface NavigatorData {
  userAgent: string;
  app?: string;
  appCodeName?: string;
  appName: string;
  languages: string[];
  oscpu: string;
  pdfViewerEnabled: boolean;
  platform: string;
  hardwareConcurrency: number;
  roles: string;
}

describe('testing browserUserData function', () => {
  it('return not available on all items if both params are falsy', async () => {
    expect(browserUserData(null, undefined)).toMatchObject({
      userAgent: 'not-available',
      app: 'not-available',
      appName: 'not-available',
      languages: 'not-available',
      oscpu: 'not-available',
      pdfViewerEnabled: 'not-available',
      platform: 'not-available',
      hardwareConcurrency: 'not-available',
      isMobile: 'not-available',
      roles: '',
    });
  });
  it('return proper data on all items if params are defined', async () => {
    const navigatorData: NavigatorData = {
      userAgent: 'Firefox',
      appCodeName: 'MobileFirefox',
      appName: 'Mobile Firefox cool',
      languages: ['en', 'es'],
      oscpu: 'oscpu',
      pdfViewerEnabled: true,
      platform: 'Win64',
      hardwareConcurrency: 2,
      roles: '',
    };
    const navigatorDataReturn: NavigatorData = { ...navigatorData, app: navigatorData.appCodeName };
    delete navigatorDataReturn.appCodeName;
    expect(
      browserUserData(navigatorData, {
        innerWidth: 320,
      }),
    ).toMatchObject({
      ...navigatorDataReturn,
      isMobile: true,
    });
    expect(
      browserUserData(
        {
          ...navigatorData,
          hardwareConcurrency: 2,
        },
        {
          innerWidth: 900,
        },
      ),
    ).toMatchObject({
      ...navigatorDataReturn,
      isMobile: false,
    });
  });
});
