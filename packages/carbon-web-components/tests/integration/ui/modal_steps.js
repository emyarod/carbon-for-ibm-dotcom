/**
 * @license
 *
 * Copyright IBM Corp. 2020, 2022
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

const { prefix } = require('../../../src/globals/settings');

describe(`${prefix}-modal`, () => {
  beforeAll(async () => {
    await page.goto(
      `http://localhost:${process.env.PORT}/iframe.html?id=components-modal--default`
    );
  });

  it('should have modal closable', async () => {
    await page.click(`${prefix}-modal-close-button button`);
    await expect(page).toHaveSelector(
      `${prefix}-modal .${prefix}--modal-container`,
      {
        state: 'hidden',
      }
    );
  });
});
