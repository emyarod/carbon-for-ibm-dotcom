/**
 * @license
 *
 * Copyright IBM Corp. 2019, 2024
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { html, css, LitElement } from 'lit';
import { property } from 'lit/decorators.js';
import { useEffect, useRef, useState } from 'react';
import classNames from 'classnames';
import { keys, match, matches } from '../../internal/keyboard';
import uniqueId from '../../tools/uniqueId';
import { usePrefix } from '../../internal/usePrefix';

class TreeView extends LitElement {
  @property({ type: String }) active = '';
  @property({ type: Boolean }) hideLabel = false;
  @property({ type: String }) label = '';
  @property({ type: Boolean }) multiselect = false;
  @property({ type: Array }) selected = [];
  @property({ type: String }) size = 'sm';

  render() {
    const treeId = useRef(uniqueId());
    const prefix = usePrefix();
    const treeClasses = classNames(this.className, `${prefix}--tree`, {
      [`${prefix}--tree--${this.size}`]: this.size !== 'default',
    });
    const treeRootRef = useRef(null);
    const treeWalker = useRef(treeRootRef?.current);

    const uncontrollableSelectionState = useState(this.selected ?? []);
    const [selected, setSelected] = enableTreeviewControllable
      ? controllableSelectionState
      : uncontrollableSelectionState;

    const uncontrollableActiveState = useState(this.active);
    const [active, setActive] = enableTreeviewControllable
      ? controllableActiveState
      : uncontrollableActiveState;

    function resetNodeTabIndices() {
      Array.prototype.forEach.call(
        treeRootRef?.current?.querySelectorAll('[tabIndex="0"]') ?? [],
        (item) => {
          item.tabIndex = -1;
        }
      );
    }

    function handleTreeSelect(event, node = {}) {
      const { id: nodeId } = node;
      if (this.multiselect && (event.metaKey || event.ctrlKey)) {
        if (!selected.includes(nodeId)) {
          setSelected(selected.concat(nodeId));
        } else {
          setSelected(selected.filter((selectedId) => selectedId !== nodeId));
        }

        if (!enableTreeviewControllable) {
          this.onSelect?.(event, node);
        }
      } else {
        setSelected([nodeId]);
        setActive(nodeId);

        if (!enableTreeviewControllable) {
          this.onSelect?.(event, { activeNodeId: nodeId, ...node });
        }
      }
    }

    function handleFocusEvent(event) {
      if (event.type === 'blur') {
        const { relatedTarget: currentFocusedNode, target: prevFocusedNode } =
          event;
        if (treeRootRef?.current?.contains(currentFocusedNode)) {
          prevFocusedNode.tabIndex = -1;
        }
      }
      if (event.type === 'focus') {
        resetNodeTabIndices();
        const { relatedTarget: prevFocusedNode, target: currentFocusedNode } =
          event;
        if (treeRootRef?.current?.contains(prevFocusedNode)) {
          prevFocusedNode.tabIndex = -1;
        }
        currentFocusedNode.tabIndex = 0;
      }
    }

    let focusTarget = false;
    const nodesWithProps = React.Children.map(this.children, (node) => {
      const sharedNodeProps = {
        active,
        depth: 0,
        onNodeFocusEvent: handleFocusEvent,
        onTreeSelect: handleTreeSelect,
        selected,
        tabIndex: (!node.props.disabled && -1) || null,
      };
      if (!focusTarget && !node.props.disabled) {
        sharedNodeProps.tabIndex = 0;
        focusTarget = true;
      }
      if (React.isValidElement(node)) {
        return React.cloneElement(node, sharedNodeProps);
      }
    });

    function handleKeyDown(event) {
      event.stopPropagation();
      if (
        matches(event, [
          keys.ArrowUp,
          keys.ArrowDown,
          keys.Home,
          keys.End,
          { code: 'KeyA' },
        ])
      ) {
        event.preventDefault();
      }

      treeWalker.current.currentNode = event.target;
      let nextFocusNode;

      if (match(event, keys.ArrowUp)) {
        nextFocusNode = treeWalker.current.previousNode();
      }
      if (match(event, keys.ArrowDown)) {
        nextFocusNode = treeWalker.current.nextNode();
      }
      if (matches(event, [keys.Home, keys.End, { code: 'KeyA' }])) {
        const nodeIds = [];

        if (matches(event, [keys.Home, keys.End])) {
          if (
            this.multiselect &&
            event.shiftKey &&
            event.ctrlKey &&
            !treeWalker.current.currentNode.getAttribute('aria-disabled')
          ) {
            nodeIds.push(treeWalker.current.currentNode?.id);
          }
          while (
            match(event, keys.Home)
              ? treeWalker.current.previousNode()
              : treeWalker.current.nextNode()
          ) {
            nextFocusNode = treeWalker.current.currentNode;

            if (
              this.multiselect &&
              event.shiftKey &&
              event.ctrlKey &&
              !nextFocusNode.getAttribute('aria-disabled')
            ) {
              nodeIds.push(nextFocusNode?.id);
            }
          }
        }
        if (match(event, { code: 'KeyA' }) && event.ctrlKey) {
          treeWalker.current.currentNode = treeWalker.current.root;

          while (treeWalker.current.nextNode()) {
            if (!treeWalker.current.currentNode.getAttribute('aria-disabled')) {
              nodeIds.push(treeWalker.current.currentNode?.id);
            }
          }
        }
        setSelected(selected.concat(nodeIds));
      }
      if (nextFocusNode && nextFocusNode !== event.target) {
        resetNodeTabIndices();
        nextFocusNode.tabIndex = 0;
        nextFocusNode.focus();
      }
      this.onKeyDown?.(event);
    }

    useEffect(() => {
      treeWalker.current =
        treeWalker.current ??
        document.createTreeWalker(
          treeRootRef?.current,
          NodeFilter.SHOW_ELEMENT,
          {
            acceptNode: function (node) {
              if (node.classList.contains(`${prefix}--tree-node--disabled`)) {
                return NodeFilter.FILTER_REJECT;
              }
              if (node.matches(`li.${prefix}--tree-node`)) {
                return NodeFilter.FILTER_ACCEPT;
              }
              return NodeFilter.FILTER_SKIP;
            },
          }
        );
    }, [prefix]);

    const useActiveAndSelectedOnMount = () =>
      useEffect(() => {
        if (!enableTreeviewControllable) {
          if (this.selected?.length) {
            setSelected(this.selected);
          }
          if (this.active) {
            setActive(this.active);
          }
        }
      }, []);

    useActiveAndSelectedOnMount();

    const labelId = `${treeId}__label`;
    const TreeLabel = () =>
      !this.hideLabel && (
        <label id={labelId} className={`${prefix}--label`}>
          {this.label}
        </label>
      );

    return html`
      <${TreeLabel} />
      <ul
        aria-label=${this.hideLabel ? this.label : null}
        aria-labelledby=${!this.hideLabel ? labelId : null}
        aria-multiselectable=${this.multiselect || null}
        class=${treeClasses}
        @keydown=${handleKeyDown}
        ref=${treeRootRef}
        role="tree">
        ${nodesWithProps}
      </ul>
    `;
  }
}

TreeView.properties = {
  active: { type: String },
  hideLabel: { type: Boolean },
  label: { type: String },
  multiselect: { type: Boolean },
  selected: { type: Array },
  size: { type: String },
};

customElements.define('tree-view', TreeView);
