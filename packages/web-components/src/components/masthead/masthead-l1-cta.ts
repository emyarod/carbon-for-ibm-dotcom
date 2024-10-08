/**
 * @license
 *
 * Copyright IBM Corp. 2020, 2024
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { html, LitElement, TemplateResult } from 'lit';
import { property, state } from 'lit/decorators.js';
import settings from '../../internal/vendor/@carbon/ibmdotcom-utilities/utilities/settings/settings';
import StableSelectorMixin from '../../globals/mixins/stable-selector';
import { carbonElement as customElement } from '../../internal/vendor/@carbon/web-components/globals/decorators/carbon-element.js';
import ArrowRight16 from '../../internal/vendor/@carbon/web-components/icons/arrow--right/16';
import ArrowLeft16 from '../../internal/vendor/@carbon/web-components/icons/arrow--left/16';
import Calendar16 from '../../internal/vendor/@carbon/web-components/icons/calendar/16.js';
import Chat16 from '../../internal/vendor/@carbon/web-components/icons/chat/16.js';
import Demo16 from '../../internal/vendor/@carbon/web-components/icons/demo/16.js';
import Email16 from '../../internal/vendor/@carbon/web-components/icons/email/16.js';
import Phone16 from '../../internal/vendor/@carbon/web-components/icons/phone/16.js';
import Quote16 from '../../internal/vendor/@carbon/web-components/icons/request-quote/16.js';
import styles from './masthead-l1.scss';
import { L1_CTA_TYPES } from './defs';
import layoutBreakpoint from './masthead-breakpoint';

const { prefix, stablePrefix: c4dPrefix } = settings;

/**
 * Masthead L1 CTA.
 *
 * @element c4d-masthead-l1-cta
 * @slot cta-text - The CTA text
 * @csspart inner-wrapper-desktop - The inner wrapper for the desktop view. Usage: `c4d-masthead-l1-cta::part(inner-wrapper-desktop)`
 * @csspart l1-button - The button element for CTA. Usage: `c4d-masthead-l1-cta::part(l1-button)`
 * @csspart l1-link - The link element for CTA. Usage: `c4d-masthead-l1-cta::part(l1-link)`
 */
@customElement(`${c4dPrefix}-masthead-l1-cta`)
class C4DMastheadL1Cta extends StableSelectorMixin(LitElement) {
  /**
   * Whether the current viewport is below 800px or not
   */
  @state()
  isMobileVersion = layoutBreakpoint.matches;

  @property()
  href: string = '';

  @property()
  type: L1_CTA_TYPES = L1_CTA_TYPES.NONE;

  /**
   * Sets attributes that enable integration with the global Contact Module app.
   *
   * @returns void
   */
  protected setCMAppAttributes() {
    const { type } = this;
    if (type) {
      this.setAttribute('data-ibm-contact', `${type}-link`);

      const textSlot = this?.shadowRoot?.querySelector('slot[name="cta-text"]');
      if (textSlot) {
        (textSlot as HTMLSlotElement).assignedElements()?.forEach((element) => {
          element.setAttribute('data-ibm-contact', `${type}-text`);
        });
      }
    }
  }

  protected firstUpdated() {
    // Allows component conditions on breakpoint change
    layoutBreakpoint.addEventListener('change', () => {
      this.isMobileVersion = layoutBreakpoint.matches;
    });
  }

  connectedCallback() {
    super.connectedCallback();
    this.setCMAppAttributes();
  }

  updated(changedProperties) {
    super.updated(changedProperties);

    if (changedProperties.has('type')) {
      this.setCMAppAttributes();
    }
  }

  render() {
    const { isMobileVersion, href, type } = this;

    const classname = isMobileVersion
      ? `${prefix}--masthead__l1-dropdown-cta`
      : `${prefix}--masthead__l1-cta`;

    // Adds inner wrapper markup in desktop displays.
    const desktopWrapper = (markup: TemplateResult) => {
      if (!isMobileVersion) {
        return html`
          <div part="inner-wrapper-desktop" class="${classname}-inner">
            ${markup}
          </div>
        `;
      }
      return markup;
    };

    /**
     * Maps L1_CTA_TYPES values to CMApp CTA options.
     *
     * @see https://github.ibm.com/live-advisor/cm-app/blob/master/docs/cm-doc.md#calls-to-action
     */
    const iconMap = new Map([
      [L1_CTA_TYPES.CONTACT_US, Chat16()],
      [L1_CTA_TYPES.CHAT_NOW, Chat16()],
      [L1_CTA_TYPES.EMAIL_US, Email16()],
      [L1_CTA_TYPES.CALL_US, Phone16()],
      [L1_CTA_TYPES.BOOK_A_CONSULTATION, Calendar16()],
      [L1_CTA_TYPES.REQUEST_A_DEMO, Demo16()],
      [L1_CTA_TYPES.REQUEST_A_QUOTE, Quote16()],
    ]);

    if (type && iconMap.has(type as L1_CTA_TYPES)) {
      const icon = iconMap.get(type as L1_CTA_TYPES);
      return html`
        <button
          part="l1-button"
          class="${classname}"
          data-ibm-contact="${type}-link">
          ${desktopWrapper(html`
            <slot name="cta-text"></slot>
            ${icon}
          `)}
        </button>
      `;
    }

    if (href) {
      const isRTL = document.dir.toLowerCase() === 'rtl';
      const ArrowIcon = isRTL ? ArrowLeft16 : ArrowRight16;
      const icon = isMobileVersion ? ArrowIcon() : '';
      return html`
        <a part="l1-link" class="${classname}" href="${href}">
          ${desktopWrapper(html`<slot name="cta-text"></slot>${icon}`)}
        </a>
      `;
    }

    return '';
  }

  static styles = styles; // `styles` here is a `CSSResult` generated by custom WebPack loader
}

export default C4DMastheadL1Cta;
