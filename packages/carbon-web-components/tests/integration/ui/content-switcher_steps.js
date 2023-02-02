/**
 * @license
 *
 * Copyright IBM Corp. 2020, 2022
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

const { prefix } = require('../../../src/globals/settings');

describe(`${prefix}-content-switcher`, () => {
  beforeAll(async () => {
    await page.goto(
      `http://localhost:${process.env.PORT}/iframe.html?id=components-content-switcher--default`
    );
  });

  it('should have content switcher interactive', async () => {
    await page.click(`${prefix}-content-switcher-item[value="router"] button`);
    await expect(page).toHaveSelector(
      `${prefix}-content-switcher-item[value="router"] button[aria-selected="true"]`
    );
  });
});
