/**
 * Copyright IBM Corp. 2021
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

'use strict';

describe('cds-search-with-typeahead', () => {
  it('should load the default cds-search-with-typeahead example', () => {
    cy.visit('/search-with-typeahead');

    // Take a snapshot for visual diffing
    cy.percySnapshot('cds-search-with-typeahead | default');
  });
});
