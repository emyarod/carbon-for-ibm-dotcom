/**
 * @license
 *
 * Copyright IBM Corp. 2019
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import '..';
import { prefix } from '../globals/settings';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      [`${prefix}-accordion`]: any;
      [`${prefix}-accordion-item`]: any;
      [`${prefix}-btn`]: any;
      [`${prefix}-breadcrumb`]: any;
      [`${prefix}-checkbox`]: any;
      [`${prefix}-code-snippet`]: any;
      [`${prefix}-combo-box`]: any;
      [`${prefix}-combo-box-item`]: any;
      [`${prefix}-content-switcher`]: any;
      [`${prefix}-content-switcher-item`]: any;
      [`${prefix}-copy-button`]: any;
      [`${prefix}-data-table`]: any;
      [`${prefix}-table`]: any;
      [`${prefix}-table-head`]: any;
      [`${prefix}-table-header-row`]: any;
      [`${prefix}-table-header-cell`]: any;
      [`${prefix}-table-body`]: any;
      [`${prefix}-table-row`]: any;
      [`${prefix}-table-cell`]: any;
      [`${prefix}-date-picker`]: any;
      [`${prefix}-date-picker-input`]: any;
      [`${prefix}-dropdown`]: any;
      [`${prefix}-dropdown-item`]: any;
      [`${prefix}-form-item`]: any;
      [`${prefix}-input`]: any;
      [`${prefix}-inline-loading`]: any;
      [`${prefix}-link`]: any;
      [`${prefix}-ordered-list`]: any;
      [`${prefix}-unordered-list`]: any;
      [`${prefix}-loading`]: any;
      [`${prefix}-modal`]: any;
      [`${prefix}-modal-body`]: any;
      [`${prefix}-modal-close-button`]: any;
      [`${prefix}-modal-footer`]: any;
      [`${prefix}-modal-header`]: any;
      [`${prefix}-modal-heading`]: any;
      [`${prefix}-modal-label`]: any;
      [`${prefix}-multi-select`]: any;
      [`${prefix}-multi-select-item`]: any;
      [`${prefix}-inline-notification`]: any;
      [`${prefix}-toast-notification`]: any;
      [`${prefix}-number-input`]: any;
      [`${prefix}-textarea`]: any;
      [`${prefix}-overflow-menu`]: any;
      [`${prefix}-overflow-menu-body`]: any;
      [`${prefix}-overflow-menu-item`]: any;
      [`${prefix}-pagination`]: any;
      [`${prefix}-page-sizes-select`]: any;
      [`${prefix}-pages-select`]: any;
      [`${prefix}-progress-indicator`]: any;
      [`${prefix}-progress-step`]: any;
      [`${prefix}-radio-button`]: any;
      [`${prefix}-radio-button-group`]: any;
      [`${prefix}-search`]: any;
      [`${prefix}-skeleton-placeholder`]: any;
      [`${prefix}-skeleton-text`]: any;
      [`${prefix}-slider`]: any;
      [`${prefix}-slider-input`]: any;
      [`${prefix}-structured-list`]: any;
      [`${prefix}-structured-list-head`]: any;
      [`${prefix}-structured-list-header-row`]: any;
      [`${prefix}-structured-list-header-cell`]: any;
      [`${prefix}-structured-list-body`]: any;
      [`${prefix}-structured-list-row`]: any;
      [`${prefix}-structured-list-cell`]: any;
      [`${prefix}-tabs`]: any;
      [`${prefix}-tab`]: any;
      [`${prefix}-tag`]: any;
      [`${prefix}-filter-tag`]: any;
      [`${prefix}-tile`]: any;
      [`${prefix}-clickable-tile`]: any;
      [`${prefix}-selectable-tile`]: any;
      [`${prefix}-tooltip`]: any;
      [`${prefix}-tooltip-body`]: any;
      [`${prefix}-tooltip-definition`]: any;
      [`${prefix}-tooltip-footer`]: any;
      [`${prefix}-tooltip-icon`]: any;
      [`${prefix}-header`]: any;
      [`${prefix}-header-nav`]: any;
      [`${prefix}-header-nav-item`]: any;
      [`${prefix}-header-menu`]: any;
      [`${prefix}-header-menu-item`]: any;
      [`${prefix}-header-menu-button`]: any;
      [`${prefix}-header-name`]: any;
      [`${prefix}-side-nav`]: any;
      [`${prefix}-side-nav-items`]: any;
      [`${prefix}-side-nav-menu`]: any;
      [`${prefix}-side-nav-menu-item`]: any;
      [`${prefix}-side-nav-link`]: any;
    }
  }
}
