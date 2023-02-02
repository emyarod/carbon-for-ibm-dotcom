/**
 * @license
 *
 * Copyright IBM Corp. 2020, 2022
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

const { prefix } = require('../../../src/globals/settings');

describe(`${prefix}-code-snippet`, () => {
  beforeAll(async () => {
    await page.goto(
      `http://localhost:${process.env.PORT}/iframe.html?id=components-code-snippet--multi-line`
    );
  });

  it('should have the expando interactive', async () => {
    await page.click(
      `${prefix}-code-snippet button.${prefix}--snippet-btn--expand`
    );
    await expect(page).toHaveSelector(
      `${prefix}-code-snippet .${prefix}-ce--snippet-container--expanded`
    );
    await page.click(
      `${prefix}-code-snippet button.${prefix}--snippet-btn--expand`
    );
    await expect(page).toHaveSelector(
      `${prefix}-code-snippet :not(.${prefix}-ce--snippet-container--expanded)`
    );
  });
});
