/**
 * @license
 *
 * Copyright IBM Corp. 2019, 2023
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { html } from 'lit';
import { action } from '@storybook/addon-actions';
import { number } from '@storybook/addon-knobs';
import { prefix } from '../../globals/settings';
import textNullable from '../../../.storybook/knob-text-nullable';
import { ifDefined } from 'lit/directives/if-defined.js';
import './copy-button';
import storyDocs from './copy-button-story.mdx';

export const Default = (args) => {
  const { buttonAssistiveText, feedbackText, feedbackTimeout, onClick } =
    args?.[`${prefix}-copy-button`] ?? {};
  return html`
    <cds-copy-button
      button-assistive-text="${ifDefined(buttonAssistiveText)}"
      feedback-text="${ifDefined(feedbackText)}"
      feedback-timeout="${ifDefined(feedbackTimeout)}"
      @click="${onClick}"></cds-copy-button>
  `;
};

Default.storyName = 'Default';

export default {
  title: 'Components/Copy button',
  parameters: {
    ...storyDocs.parameters,
    knobs: {
      [`${prefix}-copy-button`]: () => ({
        buttonAssistiveText: textNullable(
          'Assistive text for the button (button-assistive-text)',
          ''
        ),
        feedbackText: textNullable('Feedback text (feedback-text)', ''),
        feedbackTimeout: number('Feedback timeout (feedback-timeout)', 2000),
        onClick: action('click'),
      }),
    },
  },
};
