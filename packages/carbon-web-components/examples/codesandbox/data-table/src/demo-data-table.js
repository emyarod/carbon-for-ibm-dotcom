/**
 * @license
 *
 * Copyright IBM Corp. 2020, 2022
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import debounce from 'lodash-es/debounce';
import { repeat } from 'lit-html/directives/repeat';
import { html, property, customElement, LitElement } from 'lit-element';
import ifNonNull from '@carbon/web-components/es/globals/directives/if-non-null';
import Delete16 from '@carbon/web-components/es/icons/delete/16';
import Download16 from '@carbon/web-components/es/icons/download/16';
import Settings16 from '@carbon/web-components/es/icons/settings/16';
import '@carbon/web-components/es/components/button/button';
import '@carbon/web-components/es/components/overflow-menu/overflow-menu';
import '@carbon/web-components/es/components/overflow-menu/overflow-menu-body';
import '@carbon/web-components/es/components/overflow-menu/overflow-menu-item';
import '@carbon/web-components/es/components/pagination/pagination';
import '@carbon/web-components/es/components/pagination/page-sizes-select';
import '@carbon/web-components/es/components/pagination/pages-select';
import {
  TABLE_COLOR_SCHEME,
  TABLE_SIZE,
} from '@carbon/web-components/es/components/data-table/table';
import '@carbon/web-components/es/components/data-table/table-head';
import '@carbon/web-components/es/components/data-table/table-header-row';
import { TABLE_SORT_DIRECTION } from '@carbon/web-components/es/components/data-table/table-header-cell';
import '@carbon/web-components/es/components/data-table/table-body';
import '@carbon/web-components/es/components/data-table/table-row';
import '@carbon/web-components/es/components/data-table/table-cell';
import '@carbon/web-components/es/components/data-table/table-header-expand-row';
import '@carbon/web-components/es/components/data-table/table-expand-row';
import '@carbon/web-components/es/components/data-table/table-expanded-row';
import '@carbon/web-components/es/components/data-table/table-toolbar';
import '@carbon/web-components/es/components/data-table/table-toolbar-content';
import '@carbon/web-components/es/components/data-table/table-toolbar-search';
import '@carbon/web-components/es/components/data-table/table-batch-actions';
import '@carbon/web-components/es/components/data-table/table-header-cell-skeleton';
import '@carbon/web-components/es/components/data-table/table-cell-skeleton';
const { prefix } = require('../../../src/globals/settings');

/**
 * @param row A table row.
 * @param searchString A search string.
 * @returns `true` if the given table row matches the given search string.
 */
const doesRowMatchSearchString = (row, searchString) =>
  Object.keys(row).some(
    (key) => key !== 'id' && String(row[key] ?? '').indexOf(searchString) >= 0
  );

/**
 * A class to manage table states, like selection and sorting.
 * DEMONSTRATION-PURPOSE ONLY.
 * Data/state handling in data table tends to involve lots of application-specific logics
 * and thus abstracting everything in a library won't be a good return on investment
 * vs. letting users copy code here and implement features that fit their needs.
 */
// @ts-ignore `BXCEDemoDataTable` is used (only) for type reference
// eslint-disable-next-line @typescript-eslint/no-unused-vars
@customElement(`${prefix}-ce-demo-data-table`)
class BXCEDemoDataTable extends LitElement {
  /**
   * The debounced handler for user-initiated change in search string.
   * @type {Function}
   */
  _handleChangeSearchString = null;

  /**
   * The table sorting info reflecting user-initiated changes.
   * @type {TDemoSortInfo}
   */
  _sortInfo = null;

  /**
   * The table rows reflecting selection.
   * @type {TDemoTableRow[]}
   */
  _rows = null;

  /**
   * The table rows reflecting selection and filtering.
   * @type {TDemoTableRow[]}
   */
  _filteredRows = null;

  /**
   * The search string.
   * @type {string}
   */
  _searchString = '';

  /**
   * Unique ID used for form elements.
   */
  _uniqueId = Math.random().toString(36).slice(2);

  /**
   * @param lhs A value.
   * @param rhs Another value.
   * @returns
   *   * `0` if the given two values are equal
   *   * A negative value to sort `lhs` to an index lower than `rhs`
   *   * A positive value to sort `rhs` to an index lower than `lhs`
   */
  _compare(lhs, rhs) {
    if (typeof lhs === 'number' && typeof rhs === 'number') {
      return lhs - rhs;
    }
    return this.collator.compare(lhs, rhs);
  }

  /**
   * Handles Cancel button in batch action bar.
   */
  _handleCancelSelection() {
    const { _rows: oldRows, _searchString: searchString } = this;
    this._rows = this._rows.map((row) =>
      searchString && !doesRowMatchSearchString(row, searchString)
        ? row
        : { ...row, selected: false }
    );
    this.requestUpdate('_rows', oldRows);
  }

  /**
   * Handles user-initiated change in search string.
   * @param {CustomEvent} event The event.
   */
  _handleChangeSearchStringImpl({ detail }) {
    const { _searchString: oldSearchString } = this;
    this._searchString = detail.value;
    this.requestUpdate('_searchString', oldSearchString);
  }

  /**
   * Handles an event to change in selection of rows, fired from `<cds-table-row>`.
   * @param {CustomEvent} event The event.
   */
  _handleChangeSelection({ defaultPrevented, detail, target }) {
    if (!defaultPrevented) {
      const { rowId: changedRowId } = target.dataset;
      const { selected } = detail;
      const { _rows: oldRows } = this;
      this._rows = oldRows.map((row) =>
        Number(changedRowId) !== row.id ? row : { ...row, selected }
      );
      this.requestUpdate('_rows', oldRows);
    }
  }

  /**
   * Handles an event to change in selection of all rows, fired from `<cds-table-header-row>`.
   * @param {CustomEvent} event The event.
   */
  _handleChangeSelectionAll({ defaultPrevented, detail }) {
    if (!defaultPrevented) {
      const { selected } = detail;
      const { _rows: oldRows, _searchString: searchString } = this;
      this._rows = this._rows.map((row) =>
        searchString && !doesRowMatchSearchString(row, searchString)
          ? row
          : { ...row, selected }
      );
      this.requestUpdate('_rows', oldRows);
    }
  }

  /**
   * Handles an event to sort rows, fired from `<cds-table-header-cell>`.
   * @param {CustomEvent} event The event.
   */
  _handleChangeSort({ defaultPrevented, detail, target }) {
    if (!defaultPrevented) {
      const { columnId } = target.dataset;
      const { sortDirection: direction } = detail;
      const { _sortInfo: oldSortInfo } = this;
      if (direction === TABLE_SORT_DIRECTION.NONE && columnId !== 'name') {
        // Resets the sorting, given non-primary sorting column has got in non-sorting state
        this._sortInfo = this.sortInfo;
      } else {
        // Sets the sorting as user desires
        this._sortInfo = {
          columnId,
          direction,
        };
      }
      this.requestUpdate('_sortInfo', oldSortInfo);
    }
  }

  /**
   * Handles `cds-pagination-changed-current` event on the pagination UI.
   * @param {CustomEvent} event The event.
   */
  _handleChangeStart({ detail }) {
    this.start = detail.start;
  }

  /**
   * Handles `cds-pages-select-changed` event on the pagination UI.
   * @param {CustomEvent} event The event.
   */
  _handleChangePageSize({ detail }) {
    this.pageSize = detail.value;
  }

  /**
   * Handles Delete batch action button.
   */
  _handleDeleteRows() {
    const { _rows: oldRows, _searchString: searchString } = this;
    this._rows = oldRows.filter(
      (row) => !row.selected || !doesRowMatchSearchString(row, searchString)
    );
    this.requestUpdate('_rows', oldRows);
  }

  /**
   * Handles Download batch action button.
   * @param {CustomEvent} event The event.
   */
  _handleDownloadRows({ target }) {
    const blob = new Blob(
      [JSON.stringify(this._filteredRows.filter((row) => row.selected))],
      { type: 'application/json' }
    );
    target.href = URL.createObjectURL(blob);
    this._handleCancelSelection();
  }

  /**
   * @returns The content of the pagination UI.
   */
  _renderPagination() {
    const {
      pageSize,
      start,
      _filteredRows: filteredRows,
      _handleChangeStart: handleChangeStart,
      _handleChangePageSize: handleChangePageSize,
    } = this;
    if (typeof pageSize === 'undefined') {
      return undefined;
    }
    return html`
      <cds-pagination
        page-size="${pageSize}"
        start="${start}"
        total="${filteredRows.length}"
        @cds-pagination-changed-current="${handleChangeStart}"
        @cds-page-sizes-select-changed="${handleChangePageSize}">
        <cds-page-sizes-select slot="page-sizes-select">
          <option value="5">5</option>
          <option value="10">10</option>
          <option value="15">15</option>
        </cds-page-sizes-select>
        <cds-pages-select></cds-pages-select>
      </cds-pagination>
    `;
  }

  /**
   * The g11n collator to use.
   */
  @property({ attribute: false })
  collator = new Intl.Collator();

  /**
   * Data table columns.
   */
  @property({ attribute: false })
  columns = undefined;

  /**
   * Data table rows.
   */
  @property({ attribute: false })
  rows = undefined;

  /**
   * Table sorting info.
   */
  @property({ attribute: false })
  sortInfo = undefined;

  /**
   * `true` if the the table should support selection UI.
   */
  @property({ type: Boolean, reflect: true, attribute: 'has-selection' })
  hasSelection = false;

  /**
   * Number of items per page.
   */
  @property({ type: Number, attribute: 'page-size' })
  pageSize = undefined;

  /**
   * The table size.
   */
  @property({ reflect: true })
  size = TABLE_SIZE.REGULAR;

  /**
   * The table color scheme.
   */
  @property({ reflect: true, attribute: 'color-scheme' })
  colorScheme = TABLE_COLOR_SCHEME.REGULAR;

  /**
   * The row number where current page start with, index that starts with zero.
   */
  @property({ type: Number })
  start = 0;

  connectedCallback() {
    super.connectedCallback();
    if (this._handleChangeSearchString) {
      this._handleChangeSearchString.cancel();
    }
    this._handleChangeSearchString = debounce(
      this._handleChangeSearchStringImpl,
      500
    );
  }

  disconnectedCallback() {
    if (this._handleChangeSearchString) {
      this._handleChangeSearchString.cancel();
      this._handleChangeSearchString = undefined;
    }
    super.disconnectedCallback();
  }

  shouldUpdate(changedProperties) {
    if (changedProperties.has('sortInfo')) {
      this._sortInfo = this.sortInfo;
    }
    if (changedProperties.has('rows')) {
      this._rows = this.rows;
    }
    if (
      changedProperties.has('rows') ||
      changedProperties.has('_rows') ||
      changedProperties.has('_searchString')
    ) {
      const {
        pageSize,
        start,
        _rows: rows,
        _searchString: searchString,
      } = this;
      this._filteredRows = !searchString
        ? rows
        : rows.filter((row) => doesRowMatchSearchString(row, searchString));
      const count = this._filteredRows.length;
      if (count > 0 && start >= count) {
        this.start = Math.max(
          start - Math.ceil((start - count) / pageSize) * pageSize,
          0
        );
      }
    }
    return true;
  }

  render() {
    const {
      id: elementId,
      colorScheme,
      hasSelection,
      pageSize = Infinity,
      start = 0,
      size,
      columns,
      _filteredRows: filteredRows,
      _handleCancelSelection: handleCancelSelection,
      _handleDeleteRows: handleDeleteRows,
      _handleDownloadRows: handleDownloadRows,
    } = this;
    const selectionAllName = !hasSelection
      ? undefined
      : `__${prefix}-ce-demo-data-table_select-all_${
          elementId || this._uniqueId
        }`;
    const selectedRowsCountInFiltered = filteredRows.filter(
      ({ selected }) => selected
    ).length;
    const selectedAllInFiltered =
      selectedRowsCountInFiltered > 0 &&
      filteredRows.length === selectedRowsCountInFiltered;
    const hasBatchActions = hasSelection && selectedRowsCountInFiltered > 0;
    const { columnId: sortColumnId, direction: sortDirection } = this._sortInfo;
    const sortedRows =
      sortDirection === TABLE_SORT_DIRECTION.NONE
        ? filteredRows
        : filteredRows
            .slice()
            .sort(
              (lhs, rhs) =>
                this.constructor.collationFactors[sortDirection] *
                this._compare(lhs[sortColumnId], rhs[sortColumnId])
            );
    return html`
      <cds-table-toolbar>
        <cds-table-batch-actions
          ?active="${hasBatchActions}"
          selected-rows-count="${selectedRowsCountInFiltered}"
          @cds-table-batch-actions-cancel-clicked="${handleCancelSelection}">
          <cds-btn @click="${handleDeleteRows}"
            >Delete ${Delete16({ slot: 'icon' })}</cds-btn
          >
          <cds-btn
            @click="${handleDownloadRows}"
            href="javascript:void 0"
            download="table-data.json">
            Download ${Download16({ slot: 'icon' })}
          </cds-btn>
        </cds-table-batch-actions>
        <cds-table-toolbar-content ?has-batch-actions="${hasBatchActions}">
          <cds-table-toolbar-search
            @cds-search-input="${this
              ._handleChangeSearchString}"></cds-table-toolbar-search>
          <cds-overflow-menu>
            ${Settings16({ slot: 'icon' })}
            <cds-overflow-menu-body>
              <cds-overflow-menu-item> Action 1 </cds-overflow-menu-item>
              <cds-overflow-menu-item> Action 2 </cds-overflow-menu-item>
              <cds-overflow-menu-item> Action 3 </cds-overflow-menu-item>
            </cds-overflow-menu-body>
          </cds-overflow-menu>
          <cds-btn>Primary Button</cds-btn>
        </cds-table-toolbar-content>
      </cds-table-toolbar>
      <cds-table
        size="${size}"
        @cds-table-row-change-selection=${this._handleChangeSelection}
        @cds-table-change-selection-all=${this._handleChangeSelectionAll}
        @cds-table-header-cell-sort=${this._handleChangeSort}>
        <cds-table-head>
          <cds-table-header-row
            ?selected=${selectedAllInFiltered}
            selection-name=${ifNonNull(selectionAllName)}
            selection-value=${ifNonNull(selectionAllName)}>
            ${repeat(
              columns,
              ({ id: columnId }) => columnId,
              ({ id: columnId, sortCycle, title }) => {
                const sortDirectionForThisCell =
                  sortCycle &&
                  (columnId === sortColumnId
                    ? sortDirection
                    : TABLE_SORT_DIRECTION.NONE);
                return html`
                  <cds-table-header-cell
                    sort-cycle="${ifNonNull(sortCycle)}"
                    sort-direction="${ifNonNull(sortDirectionForThisCell)}"
                    data-column-id="${columnId}">
                    ${title}
                  </cds-table-header-cell>
                `;
              }
            )}
          </cds-table-header-row>
        </cds-table-head>
        <cds-table-body color-scheme="${colorScheme}">
          ${repeat(
            sortedRows.slice(start, start + pageSize),
            ({ id: rowId }) => rowId,
            (row) => {
              const { id: rowId, selected } = row;
              const selectionName = !hasSelection
                ? undefined
                : `__${prefix}-ce-demo-data-table_${
                    elementId || this._uniqueId
                  }_${rowId}`;
              const selectionValue = !hasSelection ? undefined : 'selected';
              return html`
                <cds-table-row
                  ?selected=${hasSelection && selected}
                  selection-name="${ifNonNull(selectionName)}"
                  selection-value="${ifNonNull(selectionValue)}"
                  data-row-id="${rowId}">
                  ${repeat(
                    columns,
                    ({ id: columnId }) => columnId,
                    ({ id: columnId }) =>
                      html` <cds-table-cell>${row[columnId]}</cds-table-cell> `
                  )}
                </cds-table-row>
              `;
            }
          )}
        </cds-table-body>
      </cds-table>
      ${this._renderPagination()}
    `;
  }

  /**
   * The map of how sorting direction affects sorting order.
   */
  static collationFactors = {
    [TABLE_SORT_DIRECTION.ASCENDING]: 1,
    [TABLE_SORT_DIRECTION.DESCENDING]: -1,
  };
}

export default BXCEDemoDataTable;
