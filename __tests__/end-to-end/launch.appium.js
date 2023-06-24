import wd from 'wd';

import {HOSTNAME, PORT, CONFIG, isDebug} from '../helper';

const type = isDebug ? 'debug' : 'release';
CONFIG.app = `./android/app/build/outputs/apk/${type}/app-${type}.apk`;
const driver = wd.promiseChainRemote(HOSTNAME, PORT);

describe('End to End Tests', () => {
  beforeAll(async () => {
    await driver.init(CONFIG);
    await driver.launchApp();
    await driver.sleep(10000);
  });
  beforeEach(async () => {
    await driver.sleep(1000);
  });
  afterEach(async () => {
    await driver.resetApp();
  });
  afterAll(async () => {
    if (!isDebug) {
      await driver.quit();
    }
  });

  test('App Launches', async () => {
    const element = await driver.elementByCssSelectorIfExists('android.widget.FrameLayout');
    expect(element).toBeTruthy();
  });

  test('SplashScreen is present', async () => {
    const element = await driver.elementByClassNameIfExists('android.widget.ImageView');
    expect(element).toBeTruthy();
  });

  test('SplashScreen closed and Welcome Screen was visible', async () => {
    await driver.waitForElementByAccessibilityId('welcomemessagec');
    const element = await driver.elementByAccessibilityId('welcomemessagec');
    expect(element).toBeTruthy();
    expect(await element.text()).toBe('Buy, Sell, Rent a Home');
  });
});
