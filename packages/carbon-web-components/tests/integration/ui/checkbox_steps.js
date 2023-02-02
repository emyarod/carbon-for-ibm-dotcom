/**
 * @license
 *
 * Copyright IBM Corp. 2020, 2022
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

const { prefix } = require('../../../src/globals/settings');

describe(`${prefix}-checkbox`, () => {
  beforeAll(async () => {
    await page.goto(
      `http://localhost:${process.env.PORT}/iframe.html?id=components-checkbox--default`
    );
  });

  it('should have checkbox interactive', async () => {
    await page.click(`${prefix}-checkbox label`);
    const backgroundColorValue = await page.evaluate(
      (label) =>
        label.ownerDocument.defaultView
          .getComputedStyle(label, '::before')
          .getPropertyValue('background-color'),
      await page.$(`${prefix}-checkbox label`)
    );
    expect(backgroundColorValue).toEqual(
      expect.stringMatching(/rgb\(\s*22,\s*22,\s*22\s*\)/)
    );
  });
});
