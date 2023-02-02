/**
 * @license
 *
 * Copyright IBM Corp. 2020, 2022
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

const { prefix } = require('../../../src/globals/settings');

describe(`${prefix}-tooltip`, () => {
  beforeAll(async () => {
    await page.goto(
      `http://localhost:${process.env.PORT}/iframe.html?id=components-tooltip--default`
    );
  });

  it('should have overflow menu interactive', async () => {
    await page.click(`${prefix}-tooltip`);
    await expect(page).toHaveSelector(`${prefix}-tooltip-body`, {
      state: 'visible',
    });
    await page.click('html');
    await expect(page).toHaveSelector(`${prefix}-tooltip-body`, {
      state: 'hidden',
    });
  });
});
