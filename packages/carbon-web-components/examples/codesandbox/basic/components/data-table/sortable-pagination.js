/* eslint-disable no-use-before-define */

/**
 * @license
 *
 * Copyright IBM Corp. 2022
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import TABLE_SORT_DIRECTION from './defs.js';
import { columns, rows } from './data.js';
const { prefix } = require('../../../src/globals/settings');

// event listener for the table sorting event
// triggered when user clicks on the sorting icon of the header cell
document.addEventListener(
  `${prefix}-table-header-cell-sort`,
  ({ defaultPrevented, detail, target }) => {
    if (!defaultPrevented) {
      const { columnId } = target.dataset;
      const { sortDirection: direction } = detail;
      // Sets the sorting as user desires
      const sortInfo = {
        columnId,
        direction,
      };

      table.state.setSortInfo(sortInfo);
    }
  }
);

// event listener for pagination event
// triggered when change in the row number the current page starts with
document.addEventListener(
  `${prefix}-pagination-changed-current`,
  ({ detail }) => {
    table.state.setStart(detail.start);
  }
);

// event listener for pagination event
// triggered after the number of rows per page is changed
document.addEventListener(
  `${prefix}-page-sizes-select-changed`,
  ({ detail }) => {
    table.state.setPageSize(detail.value);
  }
);

// returns pagination component
function _renderPagination() {
  const { pageSize, start } = table.state;
  if (typeof pageSize === 'undefined') {
    return undefined;
  }

  return `
    <${prefix}-pagination
      page-size="${pageSize}"
      start="${start}"
      total="${rows.length}"
    >
      <${prefix}-page-sizes-select slot="page-sizes-select">
        <option value="3">3</option>
        <option value="6">6</option>
      </${prefix}-page-sizes-select>
      <${prefix}-pages-select></${prefix}-pages-select>
    </${prefix}-pagination>
  `;
}

const collator = new Intl.Collator('en');

const table = () => {
  const { sortInfo, start, pageSize } = table.state;
  const { columnId: sortColumnId, direction: sortDirection } = sortInfo;
  // sorting logic, returns the sorted rows to render
  const sortedRows = rows.slice().sort((lhs, rhs) => {
    const lhsValue = lhs[sortInfo.columnId];
    const rhsValue = rhs[sortInfo.columnId];
    return (
      (sortInfo.direction === 'ascending' ? 1 : -1) *
      collator.compare(lhsValue, rhsValue)
    );
  });

  if (typeof pageSize === 'undefined') {
    return undefined;
  }

  return `
    <${prefix}-table>
      <${prefix}-table-head>
        <${prefix}-table-header-row>
          ${columns
            .map((column) => {
              const { id: columnId, sortCycle, title } = column;
              const sortDirectionForThisCell =
                sortCycle &&
                (columnId === sortColumnId
                  ? sortDirection
                  : TABLE_SORT_DIRECTION.NONE);
              return `<${prefix}-table-header-cell ${
                sortCycle && `sort-cycle="${sortCycle}"`
              } ${
                sortDirectionForThisCell &&
                `sort-direction="${sortDirectionForThisCell}"`
              } data-column-id="${columnId}">${title}</${prefix}-table-header-cell>`;
            })
            .join('')}
        </${prefix}-table-header-row>
      </${prefix}-table-head>
      <${prefix}-table-body>
        ${sortedRows
          .slice(start, start + pageSize)
          .map((row) => {
            const { id: rowId } = row;
            return `
          <${prefix}-table-row data-row-id="${rowId}">
            ${columns
              .map((column) => {
                const { id: columnId } = column;
                return `<${prefix}-table-cell>${row[columnId]}</${prefix}-table-cell>`;
              })
              .join('')}
          </$>`;
          })
          .join('')}
      </$>
    </${prefix}-table>
    ${_renderPagination()}
    `;
};

table.state = {
  start: 0,
  setStart: (start) => {
    setState(() => {
      table.state.start = start;
    });
  },
  pageSize: 3,
  setPageSize: (pageSize) => {
    setState(() => {
      table.state.pageSize = pageSize;
    });
  },
  sortInfo: {
    columnId: 'name',
    direction: TABLE_SORT_DIRECTION.ASCENDING,
  },
  setSortInfo: (sortInfo) => {
    setState(() => {
      table.state.sortInfo = sortInfo;
    });
  },
};

function setState(callback) {
  callback();
  updateTree(); // extracted function
}

const updateTree = () => {
  document.getElementById('sortable-pagination').innerHTML = table();
};

updateTree();
