/**
 * @license
 *
 * Copyright IBM Corp. 2019, 2023
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { LitElement, html } from 'lit';
import { property, customElement } from 'lit/decorators.js';
import Close20 from '@carbon/icons/lib/close/20';
import { ifDefined } from 'lit/directives/if-defined.js';
import { prefix } from '../../globals/settings';
import FocusMixin from '../../globals/mixins/focus';
import styles from './modal.scss';

/**
 * Modal close button.
 *
 * @element cds-modal-close-button
 * @csspart button The button.
 * @csspart close-icon The close icon.
 */
@customElement(`${prefix}-modal-close-button`)
class BXModalCloseButton extends FocusMixin(LitElement) {
  /**
   * The assistive text for the button.
   */
  @property({ attribute: 'assistive-text' })
  assistiveText = 'Close';

  render() {
    const { assistiveText } = this;
    return html`
      <button
        part="button"
        aria-label="${ifDefined(assistiveText)}"
        class="${prefix}--modal-close"
        title="${ifDefined(assistiveText)}">
        ${Close20({
          part: 'close-icon',
          class: `${prefix}--modal-close__icon`,
        })}
      </button>
    `;
  }

  static shadowRootOptions = {
    ...LitElement.shadowRootOptions,
    delegatesFocus: true,
  };
  static styles = styles; // `styles` here is a `CSSResult` generated by custom WebPack loader
}

export default BXModalCloseButton;
