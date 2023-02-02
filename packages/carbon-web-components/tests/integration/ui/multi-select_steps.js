/**
 * @license
 *
 * Copyright IBM Corp. 2020, 2022
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

const { prefix } = require('../../../src/globals/settings');

describe(`${prefix}-multi-select`, () => {
  beforeAll(async () => {
    await page.goto(
      `http://localhost:${process.env.PORT}/iframe.html?id=components-multi-select--default`
    );
  });

  it('should have multi select interactive', async () => {
    await page.click(`${prefix}-multi-select .${prefix}--list-box__field`);
    await expect(page).toHaveSelector(
      `${prefix}-multi-select .${prefix}--list-box__menu`,
      {
        state: 'visible',
      }
    );
    await page.click(`${prefix}-multi-select .${prefix}--list-box__field`);
    await expect(page).toHaveSelector(
      `${prefix}-multi-select .${prefix}--list-box__menu`,
      {
        state: 'hidden',
      }
    );
  });
});
