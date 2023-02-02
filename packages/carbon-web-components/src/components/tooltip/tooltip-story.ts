/**
 * @license
 *
 * Copyright IBM Corp. 2019, 2023
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { html } from 'lit';
import { boolean, select } from '@storybook/addon-knobs';
// Below path will be there when an application installs `@carbon/web-components` package.
// In our dev env, we auto-generate the file and re-map below path to to point to the generated file.
// @ts-ignore
import Filter16 from '@carbon/web-components/es/icons/filter/16';
import textNullable from '../../../.storybook/knob-text-nullable';
import { ifDefined } from 'lit/directives/if-defined.js';
import '../button/button';
import './tooltip';
import { FLOATING_MENU_DIRECTION } from '../floating-menu/floating-menu';
import './tooltip-body';
import './tooltip-footer';
import { TOOLTIP_ALIGNMENT, TOOLTIP_DIRECTION } from './tooltip-definition';
import './tooltip-icon';
import styles from './tooltip-story.scss';
import storyDocs from './tooltip-story.mdx';
import { prefix } from '../../globals/settings';

const tooltipBodyDirections = {
  [`Top (${FLOATING_MENU_DIRECTION.TOP})`]: FLOATING_MENU_DIRECTION.TOP,
  [`Right (${FLOATING_MENU_DIRECTION.RIGHT})`]: FLOATING_MENU_DIRECTION.RIGHT,
  [`Bottom (${FLOATING_MENU_DIRECTION.BOTTOM})`]:
    FLOATING_MENU_DIRECTION.BOTTOM,
  [`Left (${FLOATING_MENU_DIRECTION.LEFT})`]: FLOATING_MENU_DIRECTION.LEFT,
};

const tooltipAlignments = {
  [`Start (${TOOLTIP_ALIGNMENT.START})`]: TOOLTIP_ALIGNMENT.START,
  [`Center (${TOOLTIP_ALIGNMENT.CENTER})`]: TOOLTIP_ALIGNMENT.CENTER,
  [`End (${TOOLTIP_ALIGNMENT.END})`]: TOOLTIP_ALIGNMENT.END,
};

const tooltipDefinitionDirections = {
  [`Top (${TOOLTIP_DIRECTION.TOP})`]: TOOLTIP_DIRECTION.TOP,
  [`Right (${TOOLTIP_DIRECTION.RIGHT})`]: TOOLTIP_DIRECTION.RIGHT,
  [`Bottom (${TOOLTIP_DIRECTION.BOTTOM})`]: TOOLTIP_DIRECTION.BOTTOM,
  [`Left (${TOOLTIP_DIRECTION.LEFT})`]: TOOLTIP_DIRECTION.LEFT,
};

export const Default = (args) => {
  const { open } = args?.[`${prefix}-tooltip`] ?? {};
  const { alignment, direction } = args?.[`${prefix}-tooltip-body`] ?? {};
  return html`
    <style>
      ${styles}
    </style>
    <cds-tooltip ?open="${open}">
      <cds-tooltip-body
        direction="${ifDefined(direction)}"
        alignment="${ifDefined(alignment)}">
        <p>
          This is some tooltip text. This box shows the maximum amount of text
          that should appear inside. If more room is needed please use a modal
          instead.
        </p>
      </cds-tooltip-body>
    </cds-tooltip>
  `;
};

Default.storyName = 'Default';

Default.parameters = {
  knobs: {
    [`${prefix}-tooltip`]: () => ({
      open: boolean('Open (open)', false),
    }),
    [`${prefix}-tooltip-body`]: () => ({
      alignment: select(
        'Tooltip alignment to trigger button (alignment)',
        tooltipAlignments,
        TOOLTIP_ALIGNMENT.CENTER
      ),
      direction: select(
        'Direction (direction in <cds-tooltip-body>)',
        tooltipBodyDirections,
        FLOATING_MENU_DIRECTION.BOTTOM
      ),
    }),
  },
};

export const definition = (args) => {
  const { alignment, bodyText, direction } =
    args?.[`${prefix}-tooltip-definition`] ?? {};
  return html`
    <cds-tooltip-definition
      alignment="${ifDefined(alignment)}"
      body-text="${ifDefined(bodyText)}"
      direction="${ifDefined(direction)}">
      Definition Tooltip
    </cds-tooltip-definition>
  `;
};

definition.storyName = 'Definition tooltip';

definition.parameters = {
  knobs: {
    [`${prefix}-tooltip-definition`]: () => ({
      alignment: select(
        'Tooltip alignment to trigger button (alignment)',
        tooltipAlignments,
        TOOLTIP_ALIGNMENT.CENTER
      ),
      bodyText: textNullable(
        'Tooltip content (bodyText)',
        'Brief description of the dotted, underlined word above.'
      ),
      direction: select(
        'Tooltip direction (direction)',
        tooltipDefinitionDirections,
        TOOLTIP_DIRECTION.BOTTOM
      ),
    }),
  },
};

export const icon = (args) => {
  const { alignment, bodyText, direction } =
    args?.[`${prefix}-tooltip-icon`] ?? {};
  return html`
    <cds-tooltip-icon
      alignment="${ifDefined(alignment)}"
      body-text="${ifDefined(bodyText)}"
      direction="${ifDefined(direction)}">
      ${Filter16()}
    </cds-tooltip-icon>
  `;
};

icon.storyName = 'Icon tooltip';

icon.parameters = {
  knobs: {
    [`${prefix}-tooltip-icon`]:
      definition.parameters.knobs[`${prefix}-tooltip-definition`],
  },
};

export default {
  title: 'Components/Tooltip',
  parameters: {
    ...storyDocs.parameters,
  },
};
