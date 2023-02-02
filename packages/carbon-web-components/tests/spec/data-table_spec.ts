/**
 * @license
 *
 * Copyright IBM Corp. 2020, 2023
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { html, render } from 'lit';
import EventManager from '../utils/event-manager';
import { prefix } from '../../src/globals/settings';
import { ifDefined } from 'lit/directives/if-defined.js';
import { INPUT_SIZE } from '../../src/components/input/input';
import { TABLE_COLOR_SCHEME } from '../../src/components/data-table/table';
import BXTableHeaderCell, {
  TABLE_SORT_CYCLE,
  TABLE_SORT_DIRECTION,
} from '../../src/components/data-table/table-header-cell';
import BXTableRow from '../../src/components/data-table/table-row';
import BXTableExpandRow from '../../src/components/data-table/table-expand-row';
import BXTableExpandedRow from '../../src/components/data-table/table-expanded-row';
import BXTableToolbarSearch from '../../src/components/data-table/table-toolbar-search';
import { Default } from '../../src/components/data-table/data-table-story';

const template = ({ colorScheme = TABLE_COLOR_SCHEME.REGULAR, ...rest } = {}) =>
  Default({
    [`${prefix}-table`]: { ...rest },
    [`${prefix}-table-body`]: { colorScheme },
  });

const headerCellTemplate = (props?) => {
  const { sortActive, sortCycle, sortDirection } = props ?? {};
  return html`
    <cds-table-header-cell
      ?sort-active="${sortActive}"
      sort-cycle="${ifDefined(sortCycle)}"
      sort-direction="${ifDefined(sortDirection)}">
      Name
    </cds-table-header-cell>
  `;
};

const rowTemplate = (props?) => {
  const { disabled, selected, selectionName, selectionLabel, selectionValue } =
    props ?? {};
  return html`
    <cds-table-row
      ?disabled="${disabled}"
      ?selected="${selected}"
      selection-name="${ifDefined(selectionName)}"
      selection-label="${ifDefined(selectionLabel)}"
      selection-value="${ifDefined(selectionValue)}"></cds-table-row>
  `;
};

const expandRowTemplate = (props?) => {
  const {
    disabled,
    expanded,
    selected,
    selectionName,
    selectionLabel,
    selectionValue,
  } = props ?? {};
  return html`
    <cds-table-expand-row
      ?disabled="${disabled}"
      ?expanded="${expanded}"
      ?selected="${selected}"
      selection-name="${ifDefined(selectionName)}"
      selection-label="${ifDefined(selectionLabel)}"
      selection-value="${ifDefined(selectionValue)}"></cds-table-expand-row>
    <cds-table-expanded-row></cds-table-expanded-row>
  `;
};

const batchActionTemplate = (props?) => {
  const { active, selectedRowsCount } = props ?? {};
  return html`
    <cds-table-batch-actions
      ?active="${active}"
      selected-rows-count="${selectedRowsCount}"></cds-table-batch-actions>
  `;
};

const toolbarSearchTemplate = (props?) => {
  const { expanded, size } = props ?? {};
  return html`
    <cds-table-toolbar-search
      ?expanded="${expanded}"
      size="${ifDefined(size)}"></cds-table-toolbar-search>
  `;
};

describe('data-table', function () {
  const events = new EventManager();

  describe(`${prefix}-table-batch-action`, function () {
    describe('Misc attributes', function () {
      it('should render with minimum attributes', async function () {
        render(batchActionTemplate(), document.body);
        await Promise.resolve();
        expect(
          document.body.querySelector(`${prefix}-table-batch-actions` as any)
        ).toMatchSnapshot({ mode: 'shadow' });
      });

      it('should render with various attributes', async function () {
        render(
          batchActionTemplate({
            active: true,
            selectedRowsCount: 3,
          }),
          document.body
        );
        await Promise.resolve();
        expect(
          document.body.querySelector(`${prefix}-table-batch-actions` as any)
        ).toMatchSnapshot({ mode: 'shadow' });
      });

      it('should render non-plural selected rows count', async function () {
        render(
          batchActionTemplate({
            active: true,
            selectedRowsCount: 1,
          }),
          document.body
        );
        await Promise.resolve();
        expect(
          document.body.querySelector(`${prefix}-table-batch-actions` as any)
        ).toMatchSnapshot({ mode: 'shadow' });
      });
    });

    describe('Handling cancel button', function () {
      let elem: Element;

      beforeEach(async function () {
        render(batchActionTemplate({ active: true }), document.body);
        await Promise.resolve();
        elem = document.body.querySelector(`${prefix}-table-batch-actions`)!;
      });

      it('should fire a custom event', async function () {
        const spyCancel = jasmine.createSpy('cancel');
        events.on(
          elem!,
          `${prefix}-table-batch-actions-cancel-clicked`,
          spyCancel
        );
        const cancelButton = elem.shadowRoot!.querySelector(
          `.${prefix}--batch-summary__cancel`
        );
        (cancelButton as HTMLElement).click();
        await Promise.resolve();
        expect(spyCancel).toHaveBeenCalled();
      });
    });
  });

  describe(`${prefix}-table-body`, function () {
    it('should support setting zebra stripe to rows', async function () {
      render(
        template({ colorScheme: TABLE_COLOR_SCHEME.ZEBRA }),
        document.body
      );
      await Promise.resolve();
      const result = Array.prototype.every.call(
        document.body.querySelectorAll(`${prefix}-table-row`),
        (item, i) =>
          (item as BXTableRow).even === ((i + 1) % 2 === 0) &&
          (item as BXTableRow).odd === ((i + 1) % 2 !== 0)
      );
      expect(result).toBe(true);
    });

    it('should support unsetting zebra stripe to rows', async function () {
      render(template(), document.body);
      await Promise.resolve();
      const result = Array.prototype.every.call(
        document.body.querySelectorAll(`${prefix}-table-row`),
        (item) =>
          (item as BXTableRow).even === false &&
          (item as BXTableRow).odd === false
      );
      expect(result).toBe(true);
    });
  });

  describe(`${prefix}-table-header-cell`, function () {
    describe('Misc attributes', function () {
      it('should render with minimum attributes', async function () {
        render(headerCellTemplate(), document.body);
        await Promise.resolve();
        expect(
          document.body.querySelector(`${prefix}-table-header-cell` as any)
        ).toMatchSnapshot({ mode: 'shadow' });
      });

      it('should render with various attributes', async function () {
        render(
          headerCellTemplate({
            sortActive: true,
            sortCycle: TABLE_SORT_CYCLE.BI_STATES_FROM_ASCENDING,
            sortDirection: TABLE_SORT_DIRECTION.ASCENDING,
          }),
          document.body
        );
        await Promise.resolve();
        expect(
          document.body.querySelector(`${prefix}-table-header-cell` as any)
        ).toMatchSnapshot({ mode: 'shadow' });
      });
    });

    describe('Changing sort direction', function () {
      it('should support ascending -> descending cycle', async function () {
        render(
          headerCellTemplate({
            sortActive: true,
            sortCycle: TABLE_SORT_CYCLE.BI_STATES_FROM_ASCENDING,
            sortDirection: TABLE_SORT_DIRECTION.NONE,
          }),
          document.body
        );
        await Promise.resolve();
        const elem = document.body.querySelector(
          `${prefix}-table-header-cell`
        ) as BXTableHeaderCell;
        const button = elem.shadowRoot!.querySelector(
          `.${prefix}--table-sort`
        ) as HTMLButtonElement;
        button.click();
        await Promise.resolve();
        expect(elem.sortDirection).toBe(TABLE_SORT_DIRECTION.ASCENDING);
        button.click();
        await Promise.resolve();
        expect(elem.sortDirection).toBe(TABLE_SORT_DIRECTION.DESCENDING);
        button.click();
        await Promise.resolve();
        expect(elem.sortDirection).toBe(TABLE_SORT_DIRECTION.ASCENDING);
      });

      it('should support descending -> ascending cycle', async function () {
        render(
          headerCellTemplate({
            sortActive: true,
            sortCycle: TABLE_SORT_CYCLE.BI_STATES_FROM_DESCENDING,
            sortDirection: TABLE_SORT_DIRECTION.NONE,
          }),
          document.body
        );
        await Promise.resolve();
        const elem = document.body.querySelector(
          `${prefix}-table-header-cell`
        ) as BXTableHeaderCell;
        const button = elem.shadowRoot!.querySelector(
          `.${prefix}--table-sort`
        ) as HTMLButtonElement;
        button.click();
        await Promise.resolve();
        expect(elem.sortDirection).toBe(TABLE_SORT_DIRECTION.DESCENDING);
        button.click();
        await Promise.resolve();
        expect(elem.sortDirection).toBe(TABLE_SORT_DIRECTION.ASCENDING);
        button.click();
        await Promise.resolve();
        expect(elem.sortDirection).toBe(TABLE_SORT_DIRECTION.DESCENDING);
      });

      it('should support none -> ascending -> descending cycle', async function () {
        render(
          headerCellTemplate({
            sortActive: true,
            sortCycle: TABLE_SORT_CYCLE.TRI_STATES_FROM_ASCENDING,
            sortDirection: TABLE_SORT_DIRECTION.NONE,
          }),
          document.body
        );
        await Promise.resolve();
        const elem = document.body.querySelector(
          `${prefix}-table-header-cell`
        ) as BXTableHeaderCell;
        const button = elem.shadowRoot!.querySelector(
          `.${prefix}--table-sort`
        ) as HTMLButtonElement;
        button.click();
        await Promise.resolve();
        expect(elem.sortDirection).toBe(TABLE_SORT_DIRECTION.ASCENDING);
        button.click();
        await Promise.resolve();
        expect(elem.sortDirection).toBe(TABLE_SORT_DIRECTION.DESCENDING);
        button.click();
        await Promise.resolve();
        expect(elem.sortDirection).toBe(TABLE_SORT_DIRECTION.NONE);
      });

      it('should support none -> descending -> ascending cycle', async function () {
        render(
          headerCellTemplate({
            sortActive: true,
            sortCycle: TABLE_SORT_CYCLE.TRI_STATES_FROM_DESCENDING,
            sortDirection: TABLE_SORT_DIRECTION.NONE,
          }),
          document.body
        );
        await Promise.resolve();
        const elem = document.body.querySelector(
          `${prefix}-table-header-cell`
        ) as BXTableHeaderCell;
        const button = elem.shadowRoot!.querySelector(
          `.${prefix}--table-sort`
        ) as HTMLButtonElement;
        button.click();
        await Promise.resolve();
        expect(elem.sortDirection).toBe(TABLE_SORT_DIRECTION.DESCENDING);
        button.click();
        await Promise.resolve();
        expect(elem.sortDirection).toBe(TABLE_SORT_DIRECTION.ASCENDING);
        button.click();
        await Promise.resolve();
        expect(elem.sortDirection).toBe(TABLE_SORT_DIRECTION.NONE);
      });

      it('should support preventing sort order from being changed upon user gesture', async function () {
        render(
          headerCellTemplate({
            sortActive: true,
            sortCycle: TABLE_SORT_CYCLE.BI_STATES_FROM_ASCENDING,
            sortDirection: TABLE_SORT_DIRECTION.NONE,
          }),
          document.body
        );
        await Promise.resolve();
        const elem = document.body.querySelector(
          `${prefix}-table-header-cell`
        ) as BXTableHeaderCell;
        events.on(elem, `${prefix}-table-header-cell-sort`, (event) => {
          event.preventDefault();
        });
        const button = elem.shadowRoot!.querySelector(
          `.${prefix}--table-sort`
        ) as HTMLButtonElement;
        button.click();
        await Promise.resolve();
        expect(elem.sortDirection).toBe(TABLE_SORT_DIRECTION.NONE);
      });
    });
  });

  describe(`${prefix}-table-row`, function () {
    describe('Misc attributes', function () {
      it('should render with minimum attributes', async function () {
        render(rowTemplate(), document.body);
        await Promise.resolve();
        expect(
          document.body.querySelector(`${prefix}-table-row` as any)
        ).toMatchSnapshot({
          mode: 'shadow',
        });
      });

      it('should render with various attributes', async function () {
        render(
          rowTemplate({
            disabled: true,
            selected: true,
            selectionName: 'selection-name-foo',
            selectionLabel: 'selection-label-foo',
            selectionValue: 'selection-value-foo',
          }),
          document.body
        );
        await Promise.resolve();
        expect(
          document.body.querySelector(`${prefix}-table-row` as any)
        ).toMatchSnapshot({
          mode: 'shadow',
        });
      });
    });

    describe('Handling selection', function () {
      it('should fire cds-table-row-change-selection event upon selecting', async function () {
        const spyBeforeChange = jasmine.createSpy('before toggle');
        render(
          rowTemplate({
            selectionName: 'selection-name-foo',
          }),
          document.body
        );
        await Promise.resolve();
        const row = document.body.querySelector(`${prefix}-table-row`);
        events.on(
          row!,
          `${prefix}-table-row-change-selection`,
          spyBeforeChange
        );
        row!.shadowRoot!.querySelector('input')!.click();
        expect(spyBeforeChange).toHaveBeenCalled();
        expect(spyBeforeChange.calls.argsFor(0)[0].detail.selected).toBe(true);
        await Promise.resolve();
        expect((row as BXTableRow).selected).toBe(true);
      });

      it('should fire cds-table-row-change-selection event upon unselecting', async function () {
        const spyBeforeChange = jasmine.createSpy('before toggle');
        render(
          rowTemplate({
            selected: true,
            selectionName: 'selection-name-foo',
          }),
          document.body
        );
        await Promise.resolve();
        const row = document.body.querySelector(`${prefix}-table-row`);
        events.on(
          row!,
          `${prefix}-table-row-change-selection`,
          spyBeforeChange
        );
        row!.shadowRoot!.querySelector('input')!.click();
        expect(spyBeforeChange).toHaveBeenCalled();
        expect(spyBeforeChange.calls.argsFor(0)[0].detail.selected).toBe(false);
        await Promise.resolve();
        expect((row as BXTableRow).selected).toBe(false);
      });

      it('should support preventing table row selection from being toggled upon user gesture', async function () {
        render(
          rowTemplate({
            selectionName: 'selection-name-foo',
          }),
          document.body
        );
        await Promise.resolve();
        const row = document.body.querySelector(`${prefix}-table-row`);
        events.on(row!, `${prefix}-table-row-change-selection`, (event) => {
          event.preventDefault();
        });
        row!.shadowRoot!.querySelector('input')!.click();
        await Promise.resolve();
        expect((row as BXTableRow).selected).toBe(false);
      });
    });
  });

  describe(`${prefix}-table-expand-row`, function () {
    describe('Misc attributes', function () {
      it('should render with minimum attributes', async function () {
        render(expandRowTemplate(), document.body);
        await Promise.resolve();
        expect(
          document.body.querySelector(`${prefix}-table-expand-row` as any)
        ).toMatchSnapshot({ mode: 'shadow' });
      });

      it('should render with various attributes', async function () {
        render(
          expandRowTemplate({
            disabled: true,
            expanded: true,
            selected: true,
            selectionName: 'selection-name-foo',
            selectionLabel: 'selection-label-foo',
            selectionValue: 'selection-value-foo',
          }),
          document.body
        );
        await Promise.resolve();
        expect(
          document.body.querySelector(`${prefix}-table-expand-row` as any)
        ).toMatchSnapshot({ mode: 'shadow' });
      });
    });

    describe('Toggling', function () {
      it('should expand and collapse', async function () {
        render(expandRowTemplate(), document.body);
        await Promise.resolve();

        const expandRow = document.body.querySelector(
          `${prefix}-table-expand-row`
        );
        const expandedRow = document.body.querySelector(
          `${prefix}-table-expanded-row`
        );

        expandRow!.shadowRoot!.querySelector('button')!.click();
        await Promise.resolve();
        expect((expandRow as BXTableExpandRow).expanded).toBe(true);
        await Promise.resolve();
        expect((expandedRow as BXTableExpandedRow).expanded).toBe(true);

        expandRow!.shadowRoot!.querySelector('button')!.click();
        await Promise.resolve();
        expect((expandRow as BXTableExpandRow).expanded).toBe(false);
        await Promise.resolve();
        expect((expandedRow as BXTableExpandedRow).expanded).toBe(false);
      });

      it('should fire cds-table-row-expando-beingtoggled/cds-table-row-expando-toggled events upon expanding', async function () {
        const spyBeforeToggle = jasmine.createSpy('before toggle');
        const spyAfterToggle = jasmine.createSpy('after toggle');
        render(expandRowTemplate(), document.body);
        await Promise.resolve();
        const expandRow = document.body.querySelector(
          `${prefix}-table-expand-row`
        );
        events.on(
          expandRow!,
          `${prefix}-table-row-expando-beingtoggled`,
          spyBeforeToggle
        );
        events.on(
          expandRow!,
          `${prefix}-table-row-expando-toggled`,
          spyAfterToggle
        );
        expandRow!.shadowRoot!.querySelector('button')!.click();
        await Promise.resolve();
        expect(spyBeforeToggle).toHaveBeenCalled();
        expect(spyBeforeToggle.calls.argsFor(0)[0].detail.expanded).toBe(true);
        expect(spyAfterToggle).toHaveBeenCalled();
        expect(spyAfterToggle.calls.argsFor(0)[0].detail.expanded).toBe(true);
      });

      it('should fire cds-table-row-expando-beingtoggled/cds-table-row-expando-toggled events upon collapsing', async function () {
        const spyBeforeToggle = jasmine.createSpy('before toggle');
        const spyAfterToggle = jasmine.createSpy('after toggle');
        render(expandRowTemplate({ expanded: true }), document.body);
        await Promise.resolve();
        const expandRow = document.body.querySelector(
          `${prefix}-table-expand-row`
        );
        events.on(
          expandRow!,
          `${prefix}-table-row-expando-beingtoggled`,
          spyBeforeToggle
        );
        events.on(
          expandRow!,
          `${prefix}-table-row-expando-toggled`,
          spyAfterToggle
        );
        expandRow!.shadowRoot!.querySelector('button')!.click();
        await Promise.resolve();
        expect(spyBeforeToggle).toHaveBeenCalled();
        expect(spyBeforeToggle.calls.argsFor(0)[0].detail.expanded).toBe(false);
        expect(spyAfterToggle).toHaveBeenCalled();
        expect(spyAfterToggle.calls.argsFor(0)[0].detail.expanded).toBe(false);
      });

      it('should support preventing table row from being toggled upon user gesture', async function () {
        const spyAfterToggle = jasmine.createSpy('after toggle');
        render(expandRowTemplate(), document.body);
        await Promise.resolve();
        const expandRow = document.body.querySelector(
          `${prefix}-table-expand-row`
        );
        events.on(
          expandRow!,
          `${prefix}-table-row-expando-beingtoggled`,
          (event) => {
            event.preventDefault();
          }
        );
        events.on(
          expandRow!,
          `${prefix}-table-row-expando-toggled`,
          spyAfterToggle
        );
        expandRow!.shadowRoot!.querySelector('button')!.click();
        await Promise.resolve();
        expect(spyAfterToggle).not.toHaveBeenCalled();
      });
    });

    describe('Hovering over', function () {
      it('should toggle the highlight of the expanded content', async function () {
        render(expandRowTemplate(), document.body);
        await Promise.resolve();

        const expandRow = document.body.querySelector(
          `${prefix}-table-expand-row`
        );
        const expandedRow = document.body.querySelector(
          `${prefix}-table-expanded-row`
        );

        expandRow!.dispatchEvent(
          new CustomEvent('mouseover', { bubbles: true })
        );
        expect((expandedRow as BXTableExpandedRow).highlighted).toBe(true);

        expandRow!.dispatchEvent(
          new CustomEvent('mouseout', { bubbles: true })
        );
        expect((expandedRow as BXTableExpandedRow).highlighted).toBe(false);
      });
    });
  });

  describe(`${prefix}-table-toolbar-search`, function () {
    describe('Misc attributes', function () {
      it('should render with minimum attributes', async function () {
        render(toolbarSearchTemplate(), document.body);
        await Promise.resolve();
        expect(
          document.body.querySelector(`${prefix}-table-toolbar-search` as any)
        ).toMatchSnapshot({ mode: 'shadow' });
      });

      it('should render with various attributes', async function () {
        render(
          toolbarSearchTemplate({
            expanded: true,
            size: INPUT_SIZE.EXTRA_LARGE,
          }),
          document.body
        );
        await Promise.resolve();
        expect(
          document.body.querySelector(`${prefix}-table-toolbar-search` as any)
        ).toMatchSnapshot({ mode: 'shadow' });
      });
    });

    describe('Expanding/collapsing', function () {
      it('should expand and focus on the search box upon getting focus on the root', async function () {
        render(toolbarSearchTemplate(), document.body);
        await Promise.resolve();
        const toolbarSearch = document.body.querySelector(
          `${prefix}-table-toolbar-search`
        );
        const input = toolbarSearch!.shadowRoot!.querySelector('input');
        spyOn(input!, 'focus');
        toolbarSearch!.dispatchEvent(
          new CustomEvent('focusin', { bubbles: true })
        );
        expect((toolbarSearch as BXTableToolbarSearch).expanded).toBe(true);
        await Promise.resolve();
        await Promise.resolve();
        expect(input!.focus).toHaveBeenCalled();
      });

      it('should collapse upon losing focus on the root', async function () {
        render(toolbarSearchTemplate({ expanded: true }), document.body);
        await Promise.resolve();
        const toolbarSearch = document.body.querySelector(
          `${prefix}-table-toolbar-search`
        );
        toolbarSearch!.dispatchEvent(
          new CustomEvent('focusout', { bubbles: true })
        );
        expect((toolbarSearch as BXTableToolbarSearch).expanded).toBe(false);
      });
    });
  });

  afterEach(async function () {
    await render(undefined!, document.body);
    events.reset();
  });
});
