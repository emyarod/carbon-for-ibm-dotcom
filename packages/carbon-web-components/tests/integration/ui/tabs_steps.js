/**
 * @license
 *
 * Copyright IBM Corp. 2020, 2022
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

const { prefix } = require('../../../src/globals/settings');

describe(`${prefix}-tabs`, () => {
  beforeAll(async () => {
    await page.goto(
      `http://localhost:${process.env.PORT}/iframe.html?id=components-tabs--default`
    );
  });

  it('should have tabs interactive', async () => {
    await page.click(`${prefix}-tab[value="router"] a`);
    await expect(page).toHaveSelector('#panel-all', { state: 'hidden' });
    await expect(page).toHaveSelector('#panel-cloudFoundry', {
      state: 'hidden',
    });
    await expect(page).toHaveSelector('#panel-staging', { state: 'hidden' });
    await expect(page).toHaveSelector('#panel-dea', { state: 'hidden' });
    await expect(page).toHaveSelector('#panel-router', { state: 'visible' });
  });
});
