/**
 * @license
 *
 * Copyright IBM Corp. 2020, 2021
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { customElement, html, LitElement, property } from 'lit-element';
import ddsSettings from '@carbon/ibmdotcom-utilities/es/utilities/settings/settings.js';
import settings from 'carbon-components/es/globals/js/settings';
import Reset from 'carbon-web-components/es/icons/reset/16';
import HostListenerMixin from 'carbon-web-components/es/globals/mixins/host-listener';
import StableSelectorMixin from '../../globals/mixins/stable-selector';
import styles from './filter-panel.scss';

const { prefix } = settings;
const { stablePrefix: ddsPrefix } = ddsSettings;

/**
 * The filter panel.
 *
 * @element dds-filter-panel
 */
@customElement(`${ddsPrefix}-filter-panel`)
class DDSFilterPanel extends HostListenerMixin(StableSelectorMixin(LitElement)) {
  /**
   * Renders the filter heading
   */
  @property()
  heading!: string;

  /**
   * Handles `click` event on the `<input>` in the shadow DOM.
   */
  protected _handleClear() {
    const { eventSelectionClear } = this.constructor as typeof DDSFilterPanel;
    this.dispatchEvent(
      new CustomEvent(eventSelectionClear, {
        bubbles: true,
        composed: true,
        detail: {
          clear: true,
        },
      })
    );
  }

  /**
   * the filter title
   */
  @property()
  title = '';

  /**
   * renders the selected values
   */
  @property()
  selectedValues: any[] = [];

  /**
   * Handles items in the selected array
   */
  @property({ attribute: 'has-selections', type: Boolean })
  hasSelections = false;

  // eslint-disable-next-line class-methods-use-this, @typescript-eslint/no-unused-vars
  protected _handleContentStateChange(_: CustomEvent) {}

  render() {
    return html`
      <section class="${prefix}--filter-panel__section">
        <div class="${prefix}--heading-clear">
          <div class="${prefix}--filter__heading">${this.heading}</div>
          <button class="${prefix}--clear" @click=${this._handleClear}>
            <div class="${prefix}--clear__container">
              Clear
              <div class="${prefix}--reset__icon">${Reset()}</div>
            </div>
          </button>
        </div>
        <slot></slot>
      </section>
    `;
  }

  static get eventContentStateChange() {
    return `${ddsPrefix}-filter-panel-input-select`;
  }

  static get eventSelectionClear() {
    return `${ddsPrefix}-selection-clear`;
  }

  static get stableSelector() {
    return `${ddsPrefix}-filter-panel`;
  }

  static styles = styles; // `styles` here is a `CSSResult` generated by custom WebPack loader
}

export default DDSFilterPanel;
