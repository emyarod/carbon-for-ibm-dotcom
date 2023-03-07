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
import Checkmark16 from '@carbon/icons/lib/checkmark/16';
import { prefix } from '../../globals/settings';
import { DROPDOWN_SIZE } from './dropdown';
import styles from './dropdown.scss';

/**
 * Dropdown item.
 *
 * @element cds-dropdown-item
 * @csspart selected-icon The selected icon.
 */
@customElement(`${prefix}-dropdown-item`)
class BXDropdownItem extends LitElement {
  /**
   * `true` if this dropdown item should be disabled.
   */
  @property({ type: Boolean, reflect: true })
  disabled = false;

  /**
   * `true` if this dropdown item should be highlighted.
   * If `true`, parent `<dropdown>` selects/deselects this dropdown item upon keyboard interaction.
   *
   * @private
   */
  @property({ type: Boolean, reflect: true })
  highlighted = false;

  /**
   * `true` if this dropdown item should be selected.
   *
   * @private
   */
  @property({ type: Boolean, reflect: true })
  selected = false;

  /**
   * Dropdown size.
   */
  @property({ reflect: true })
  size = DROPDOWN_SIZE.REGULAR;

  /**
   * The `value` attribute that is set to the parent `<cds-dropdown>` when this dropdown item is selected.
   */
  @property()
  value = '';

  render() {
    const { selected } = this;
    return html`
      <div class="${prefix}--list-box__menu-item__option">
        <slot></slot>
        ${!selected
          ? undefined
          : Checkmark16({
              part: 'selected-icon',
              class: `${prefix}--list-box__menu-item__selected-icon`,
            })}
      </div>
    `;
  }

  static styles = styles;
}

export default BXDropdownItem;
