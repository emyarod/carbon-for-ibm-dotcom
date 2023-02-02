/**
 * @license
 *
 * Copyright IBM Corp. 2019, 2023
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { html } from 'lit';
import { select } from '@storybook/addon-knobs';
import { ifDefined } from 'lit/directives/if-defined.js';
import { SKELETON_TEXT_TYPE } from './skeleton-text';
import storyDocs from './skeleton-text-story.mdx';
import { prefix } from '../../globals/settings';

const types = {
  Regular: null,
  [`Heading (${SKELETON_TEXT_TYPE.HEADING})`]: SKELETON_TEXT_TYPE.HEADING,
};

export const Default = (args) => {
  const { type } = args?.[`${prefix}-skeleton-text`] ?? {};
  return html`
    <cds-skeleton-text type="${ifDefined(type)}"></cds-skeleton-text>
  `;
};

Default.storyName = 'Default';

Default.parameters = {
  knobs: {
    [`${prefix}-skeleton-text'`]: () => ({
      type: select('Skeleton text type (type)', types, null),
    }),
  },
};

export const lines = () => html`
  <cds-skeleton-text type="line"></cds-skeleton-text>
  <cds-skeleton-text type="line"></cds-skeleton-text>
  <cds-skeleton-text type="line"></cds-skeleton-text>
`;

lines.decorators = [
  (story) => html` <div style="width:300px">${story()}</div> `,
];

export default {
  title: 'Components/Skeleton text',
  parameters: {
    ...storyDocs.parameters,
    percy: {
      skip: true,
    },
  },
};
