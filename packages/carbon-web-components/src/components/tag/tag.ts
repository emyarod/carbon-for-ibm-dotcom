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
import { prefix } from '../../globals/settings';
import { TAG_SIZE, TAG_TYPE } from './defs';
import styles from './tag.scss';

export { TAG_SIZE, TAG_TYPE };

/**
 * Tag.
 *
 * @element cds-tag
 */
@customElement(`${prefix}-tag`)
class BXTag extends LitElement {
  /**
   * `true` if the tag should be disabled
   */
  @property({ type: Boolean, reflect: true })
  disabled = false;

  /**
   * The size of the tag.
   */
  @property({ reflect: true })
  size = TAG_SIZE.REGULAR;

  /**
   * The type of the tag.
   */
  @property({ reflect: true })
  type = TAG_TYPE.GRAY;

  render() {
    return html` <slot></slot> `;
  }

  static styles = styles; // `styles` here is a `CSSResult` generated by custom WebPack loader
}

export default BXTag;
