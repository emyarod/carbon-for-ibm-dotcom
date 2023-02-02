/**
 * @license
 *
 * Copyright IBM Corp. 2020, 2022
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

const { prefix } = require('../../../src/globals/settings');

describe(`${prefix}-inline-notification`, () => {
  beforeAll(async () => {
    await page.goto(
      `http://localhost:${process.env.PORT}/iframe.html?id=components-notifications--inline`
    );
  });

  it('should have notification closable', async () => {
    await page.click(
      `${prefix}-inline-notification .${prefix}--inline-notification__close-button`
    );
    await expect(page).toHaveSelector(`${prefix}-inline-notification`, {
      state: 'hidden',
    });
  });
});

describe(`${prefix}-toast-notification`, () => {
  beforeAll(async () => {
    await page.goto(
      `http://localhost:${process.env.PORT}/iframe.html?id=components-notifications--toast`
    );
  });

  it('should have notification closable', async () => {
    await page.click(
      `${prefix}-toast-notification .${prefix}--toast-notification__close-button`
    );
    await expect(page).toHaveSelector(`${prefix}-toast-notification`, {
      state: 'hidden',
    });
  });
});
