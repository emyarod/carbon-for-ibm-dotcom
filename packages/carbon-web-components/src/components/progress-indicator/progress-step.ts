/**
 * @license
 *
 * Copyright IBM Corp. 2019, 2023
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { html, svg, property, customElement, LitElement } from 'lit-element';
import CheckmarkOutline16 from '@carbon/icons/lib/checkmark--outline/16';
import CircleDash16 from '@carbon/icons/lib/circle-dash/16';
import Incomplete16 from '@carbon/icons/lib/incomplete/16';
import Warning16 from '@carbon/icons/lib/warning/16';
import { prefix } from '../../globals/settings';
import FocusMixin from '../../globals/mixins/focus';
import { PROGRESS_STEP_STAT } from './defs';
import styles from './progress-indicator.scss';

export { PROGRESS_STEP_STAT };

/**
 * Icons, keyed by state.
 */
const icons = {
  [PROGRESS_STEP_STAT.COMPLETE]: CheckmarkOutline16,
  [PROGRESS_STEP_STAT.INCOMPLETE]: CircleDash16,
  [PROGRESS_STEP_STAT.INVALID]: Warning16,
  [PROGRESS_STEP_STAT.CURRENT]: Incomplete16,
};

/**
 * Progress step.
 *
 * @element bx-progress-step
 * @slot secondary-label-text - The secondary progress label.
 */
@customElement(`${prefix}-progress-step`)
class BXProgressStep extends FocusMixin(LitElement) {
  /**
   * `true` if the progress step should be disabled.
   */
  @property({ type: Boolean, reflect: true })
  disabled = false;

  /**
   * The a11y text for the icon.
   */
  @property({ attribute: 'icon-label' })
  iconLabel!: string;

  /**
   * The primary progress label.
   */
  @property({ attribute: 'label-text' })
  labelText!: string;

  /**
   * The secondary progress label.
   */
  @property({ attribute: 'secondary-label-text' })
  secondaryLabelText!: string;

  /**
   * The progress state.
   */
  @property()
  state = PROGRESS_STEP_STAT.QUEUED;

  /**
   * `true` if the progress step should be vertical.
   *
   * @private
   */
  @property({ type: Boolean, reflect: true })
  vertical = false;

  createRenderRoot() {
    return this.attachShadow({
      mode: 'open',
      delegatesFocus:
        Number((/Safari\/(\d+)/.exec(navigator.userAgent) ?? ['', 0])[1]) <=
        537,
    });
  }

  connectedCallback() {
    if (!this.hasAttribute('role')) {
      this.setAttribute('role', 'listitem');
    }
    super.connectedCallback();
  }

  updated(changedProperties) {
    if (changedProperties.has('disabled')) {
      this.setAttribute('aria-disabled', String(Boolean(this.disabled)));
    }
  }

  render() {
    const { iconLabel, labelText, secondaryLabelText, state } = this;
    return html`
      ${icons[state]({
        class: {
          [PROGRESS_STEP_STAT.INVALID]: `${prefix}--progress__warning`,
        }[state],
        children: !iconLabel ? undefined : svg`<title>${iconLabel}</title>`,
      })}
      <slot>
        <p
          role="button"
          class="${prefix}--progress-label"
          tabindex="0"
          aria-describedby="label-tooltip">
          ${labelText}
        </p>
      </slot>
      <slot name="secondary-label-text">
        ${!secondaryLabelText
          ? undefined
          : html`
              <p class="${prefix}--progress-optional">${secondaryLabelText}</p>
            `}
      </slot>
      <span class="${prefix}--progress-line"></span>
    `;
  }

  static styles = styles;
}

export default BXProgressStep;
