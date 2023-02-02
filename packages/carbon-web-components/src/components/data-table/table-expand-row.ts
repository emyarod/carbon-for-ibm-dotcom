/**
 * @license
 *
 * Copyright IBM Corp. 2020, 2023
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { html } from 'lit';
import { property, customElement } from 'lit/decorators.js';
import ChevronRight16 from '@carbon/icons/lib/chevron--right/16';
import { prefix } from '../../globals/settings';
import HostListenerMixin from '../../globals/mixins/host-listener';
import HostListener from '../../globals/decorators/host-listener';
import BXTableRow from './table-row';
import BXTableExpandedRow from './table-expanded-row';
import styles from './data-table.scss';

/**
 * The expando row in table row.
 *
 * @element cds-table-expand-row
 */
@customElement(`${prefix}-table-expand-row`)
class BXTableExpandRow extends HostListenerMixin(BXTableRow) {
  /**
   * Handles `click` event on the expando button.
   */
  private _handleClickExpando() {
    this._handleUserInitiatedToggleExpando();
  }

  /**
   * Handles `mouseover`/`mouseout` event handler on this element.
   *
   * @param event The event.
   */
  @HostListener('mouseover')
  @HostListener('mouseout')
  // @ts-ignore: The decorator refers to this method but TS thinks this method is not referred to
  private _handleMouseOverOut(event: MouseEvent) {
    const { selectorExpandedRow } = this.constructor as typeof BXTableExpandRow;
    const { nextElementSibling } = this;
    if (nextElementSibling?.matches(selectorExpandedRow)) {
      (nextElementSibling as BXTableExpandedRow).highlighted =
        event.type === 'mouseover';
    }
  }

  /**
   * Handles user-initiated toggle request of the expando button in this table row.
   *
   * @param expanded The new expanded state.
   */
  private _handleUserInitiatedToggleExpando(expanded = !this.expanded) {
    const init = {
      bubbles: true,
      cancelable: true,
      composed: true,
      detail: {
        expanded,
      },
    };
    if (
      this.dispatchEvent(
        new CustomEvent(
          (
            this.constructor as typeof BXTableExpandRow
          ).eventBeforeExpandoToggle,
          init
        )
      )
    ) {
      this.expanded = expanded;
      this.dispatchEvent(
        new CustomEvent(
          (this.constructor as typeof BXTableExpandRow).eventExpandoToggle,
          init
        )
      );
    }
  }

  protected _renderFirstCells() {
    const { _handleClickExpando: handleClickExpando } = this;
    return html`
      <div class="${prefix}--table-expand">
        <button
          class="${prefix}--table-expand__button"
          @click="${handleClickExpando}">
          ${ChevronRight16({ class: `${prefix}--table-expand__svg` })}
        </button>
      </div>
      ${super._renderFirstCells()}
    `;
  }

  /**
   * `true` if the table row should be expanded.
   */
  @property({ type: Boolean, reflect: true })
  expanded = false;

  updated(changedProperties) {
    if (changedProperties.has('expanded')) {
      const { selectorExpandedRow } = this
        .constructor as typeof BXTableExpandRow;
      const { expanded, nextElementSibling } = this;
      if (nextElementSibling?.matches(selectorExpandedRow)) {
        (nextElementSibling as BXTableExpandedRow).expanded = expanded;
      }
    }
  }

  /**
   * A selector that will return the corresponding expanded row.
   */
  static get selectorExpandedRow() {
    return `${prefix}-table-expanded-row`;
  }

  /**
   * The name of the custom event fired before the expanded state this row is being toggled upon a user gesture.
   * Cancellation of this event stops the user-initiated action of toggling the expanded state.
   */
  static get eventBeforeExpandoToggle() {
    return `${prefix}-table-row-expando-beingtoggled`;
  }

  /**
   * The name of the custom event fired after the expanded state this row is toggled upon a user gesture.
   */
  static get eventExpandoToggle() {
    return `${prefix}-table-row-expando-toggled`;
  }

  static styles = styles; // `styles` here is a `CSSResult` generated by custom WebPack loader
}

export default BXTableExpandRow;
