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

// event listener for the sorting event
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

const collator = new Intl.Collator('en');

const table = () => {
  // sorting logic, returns the sorted rows to render
  const sortedRows = rows.slice().sort((lhs, rhs) => {
    const lhsValue = lhs[table.state.sortInfo.columnId];
    const rhsValue = rhs[table.state.sortInfo.columnId];
    return (
      (table.state.sortInfo.direction === 'ascending' ? 1 : -1) *
      collator.compare(lhsValue, rhsValue)
    );
  });

  const { columnId: sortColumnId, direction: sortDirection } =
    table.state.sortInfo;

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
          </${prefix}-table-row>`;
          })
          .join('')}
      </${prefix}-table-body>
    </${prefix}-table>`;
};

table.state = {
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
  document.getElementById('sortable-table').innerHTML = table();
};

updateTree();
