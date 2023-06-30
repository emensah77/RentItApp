import wd from 'wd';

import {HOSTNAME, PORT, CONFIG} from '../helper';

const driver = wd.promiseChainRemote(HOSTNAME, PORT);
const waitTime = 300000;
const visibility = [
  {
    title: 'Welcome',
    accessibilityId: 'welcomemessage',
    text: 'Buy, Sell, Rent a Home',
  },
  {
    title: 'Welcome (With a Nav Buttonn)',
    accessibilityId: 'Go To Email',
    click: true,
    sleep: 2000,
  },
  {
    fullTitle: 'Navigates to email screen',
    title: 'Email',
    accessibilityId: 'Log in or sign up',
  },
  {
    title: 'Email',
    accessibilityId: 'Sign up in or sign up',
  },
];

describe('End to End Tests', () => {
  jest.setTimeout(waitTime * visibility.length);

  beforeAll(async () => {
    await driver.init(CONFIG);
    await driver.launchApp();
  });

  test('App Launches', async () => {
    const element = await driver.elementByCssSelectorIfExists('android.widget.FrameLayout');
    expect(element).toBeTruthy();
  });

  test('SplashScreen is present', async () => {
    const element = await driver.elementByClassNameIfExists('android.widget.ImageView');
    expect(element).toBeTruthy();
  });

  visibility.forEach(({fullTitle, title, accessibilityId, text, click, sleep}) => {
    test(fullTitle || `The ${title} Screen is visible`, async () => {
      const timestamp = new Date().getTime();
      await driver.waitForElementByAccessibilityId(
        accessibilityId,
        wd.asserters.isDisplayed,
        waitTime,
        5000,
        (_, elem) =>
          console.debug(
            `${title} Screen done in ${new Date().getTime() - timestamp}ms, ${
              elem ? 'and found the element.' : 'with an error.'
            }`,
          ),
      );

      const element = await driver.elementByAccessibilityId(accessibilityId);
      expect(element).toBeTruthy();

      if (text) {
        expect(await element.text()).toBe(text);
      }

      if (click) {
        element.click();
      }

      if (sleep) {
        await driver.sleep(sleep);
      }
    });
  });
});
