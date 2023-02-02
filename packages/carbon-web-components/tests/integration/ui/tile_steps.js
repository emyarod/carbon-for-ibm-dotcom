/**
 * @license
 *
 * Copyright IBM Corp. 2020, 2022
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

const { prefix } = require('../../../src/globals/settings');

describe(`${prefix}-tile`, () => {
  beforeAll(async () => {
    await page.goto(
      `http://localhost:${process.env.PORT}/iframe.html?id=components-tile--expandable`
    );
  });

  it('should have the expando interactive', async () => {
    await page.click(`${prefix}-expandable-tile button`);
    // Playwright's auto-wait-for-transitionend feature does not seems to work here,
    // presubably because animation happens after EOM
    await page.waitForFunction(
      () =>
        document.querySelector(`${prefix}-expandable-tile`).offsetHeight > 300,
      { polling: 'raf' }
    );
    await page.click(`${prefix}-expandable-tile button`);
    // Playwright's auto-wait-for-transitionend feature does not seems to work here,
    // presubably because animation happens after EOM
    await page.waitForFunction(
      () =>
        document.querySelector(`${prefix}-expandable-tile`).offsetHeight < 300,
      { polling: 'raf' }
    );
  });
});
