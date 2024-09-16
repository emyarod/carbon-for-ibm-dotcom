/**
 * @license
 *
 * Copyright IBM Corp. 2020, 2023
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { css } from 'lit';
import { property } from 'lit/decorators.js';
import settings from '../../internal/vendor/@carbon/ibmdotcom-utilities/utilities/settings/settings';
import StableSelectorMixin from '../../globals/mixins/stable-selector';
import C4DMarkdown from '../markdown/markdown';
import { CONTENT_BLOCK_COPY_SIZE } from './defs';
import './content-block-paragraph';
import styles from './content-block.scss';
import { carbonElement as customElement } from '../../internal/vendor/@carbon/web-components/globals/decorators/carbon-element';

export { CONTENT_BLOCK_COPY_SIZE };

const { stablePrefix: c4dPrefix } = settings;

/**
 * The copy content of content block.
 *
 * @element c4d-content-block-copy
 * @csspart content-block-paragraph - The paragraph element within the content block. Usage: `c4d-content-block-copy::part(content-block-paragraph)`
 */
@customElement(`${c4dPrefix}-content-block-copy`)
class C4DContentBlockCopy extends StableSelectorMixin(C4DMarkdown) {
  protected get _customTags() {
    const tags = new Set(super._customTags);
    tags.add(`${c4dPrefix}-content-block-paragraph`);
    return tags;
  }

  protected get _renderer() {
    this.childNodes.forEach((node) => {
      if (node.nodeType === Node.TEXT_NODE) {
        this.removeChild(node);
      }
    });

    return Object.assign(super._renderer, {
      paragraph(text) {
        return `<${c4dPrefix}-content-block-paragraph part="content-block-paragraph">${text}</${c4dPrefix}-content-block-paragraph>`;
      },
    });
  }

  /**
   * The default slot for all content-block-copy use cases.
   * The content size.
   */
  @property({ reflect: true })
  size = CONTENT_BLOCK_COPY_SIZE.REGULAR;

  /**
   * The shadow slot this copy content should be in.
   */
  @property({ reflect: true })
  slot = 'copy';

  static get stableSelector() {
    return `${c4dPrefix}--content-block__copy`;
  }

  // `styles` here is a `CSSResult` generated by custom WebPack loader
  static get styles() {
    return css`
      ${super.styles}${styles}
    `;
  }
}

/* @__GENERATE_REACT_CUSTOM_ELEMENT_TYPE__ */
export default C4DContentBlockCopy;
