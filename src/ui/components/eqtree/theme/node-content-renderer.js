import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './tree.css';
import './node-content-renderer.css';

function isDescendant(older, younger) {
    return (
        !!older.children &&
        typeof older.children !== 'function' &&
        older.children.some(
            child => child === younger || isDescendant(child, younger)
        )
    );
}

// eslint-disable-next-line react/prefer-stateless-function
class CustomThemeNodeContentRenderer extends Component {
    render() {
        const {
            scaffoldBlockPxWidth,
            toggleChildrenVisibility,
            connectDragPreview,
            connectDragSource,
            isDragging,
            canDrop,
            canDrag,
            node,
            title,
            subtitle,
            draggedNode,
            path,
            treeIndex,
            isSearchMatch,
            isSearchFocus,
            isNodeSelected,
            icons,
            buttons,
            className,
            style,
            didDrop,
            lowerSiblingCounts,
            listIndex,
            swapFrom,
            swapLength,
            swapDepth,
            treeId, // Not needed, but preserved for other renderers
            isOver, // Not needed, but preserved for other renderers
            parentNode, // Needed for dndManager
            ...otherProps
        } = this.props;
        const nodeTitle = title || node.id;
        const nodeSubtitle = subtitle || node.name;

        const isDraggedDescendant = draggedNode && isDescendant(draggedNode, node);
        const isLandingPadActive = !didDrop && isDragging;

        const nodeContent = connectDragPreview(
            <div
                className={
                    'row' +
                    (isLandingPadActive ? ` rowLandingPad` : '') +
                    (isLandingPadActive && !canDrop ? ` rowCancelPad` : '') +
                    (isSearchMatch ? ` rowSearchMatch` : '') +
                    (isSearchFocus ? ` rowSearchFocus` : '') +
                    (isNodeSelected(node) ? ` rowSelected` : '') +
                    (className ? ` ${className}` : '')
                }
                style={{
                    opacity: isDraggedDescendant ? 0.5 : 1,
                    ...style,
                }}
            >
                <div
                    className={
                        'rowContents' +
                        (!canDrag ? ` rowContentsDragDisabled` : '')
                    }
                >
                    <div className='rowToolbar'>
                        {icons.map((icon, index) => (
                            <div key={index}>
                                {icon}
                            </div>
                        ))}
                    </div>

                    <div className='rowLabel'>
            <span
                className={
                    'rowTitle' +
                    (node.subtitle ? ` rowTitleWithSubtitle` : '')
                }
            >
              {typeof nodeTitle === 'function'
                  ? nodeTitle({
                      node,
                      path,
                      treeIndex,
                  })
                  : nodeTitle}
            </span>

                        {nodeSubtitle && (
                            <span className='rowSubtitle'>
                {typeof nodeSubtitle === 'function'
                    ? nodeSubtitle({
                        node,
                        path,
                        treeIndex,
                    })
                    : ` - ${nodeSubtitle}`}
              </span>
                        )}
                    </div>

                    <div className='rowToolbar'>
                        {buttons.map((btn, index) => (
                            <div
                                key={index} // eslint-disable-line react/no-array-index-key
                                className='toolbarButton'
                            >
                                {btn}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );

        return (
            <div style={{ height: '100%' }} {...otherProps}>
                {toggleChildrenVisibility &&
                node.children &&
                (node.children.length > 0 || typeof node.children === 'function') && (
                    <div>
                        <button
                            type="button"
                            aria-label={node.expanded ? 'Collapse' : 'Expand'}
                            className={
                                node.expanded ? 'collapseButton' : 'expandButton'
                            }
                            style={{ left: -0.5 * scaffoldBlockPxWidth }}
                            onClick={() =>
                                toggleChildrenVisibility({
                                    node,
                                    path,
                                    treeIndex,
                                })
                            }
                        />

                        {node.expanded &&
                        !isDragging && (
                            <div
                                style={{ width: scaffoldBlockPxWidth }}
                                className='lineChildren'
                            />
                        )}
                    </div>
                )}

                <div
                    className={
                        'rowWrapper' +
                        (!canDrag ? ` rowWrapperDragDisabled` : '')
                    }
                >
                    {canDrag
                        ? connectDragSource(nodeContent, { dropEffect: 'copy' })
                        : nodeContent}
                </div>
            </div>
        );
    }
}

CustomThemeNodeContentRenderer.defaultProps = {
    buttons: [],
    canDrag: false,
    canDrop: false,
    className: '',
    draggedNode: null,
    icons: [],
    isSearchFocus: false,
    isSearchMatch: false,
    parentNode: null,
    style: {},
    subtitle: null,
    swapDepth: null,
    swapFrom: null,
    swapLength: null,
    title: null,
    toggleChildrenVisibility: null,
};

CustomThemeNodeContentRenderer.propTypes = {
    buttons: PropTypes.arrayOf(PropTypes.node),
    canDrag: PropTypes.bool,
    className: PropTypes.string,
    icons: PropTypes.arrayOf(PropTypes.node),
    isSearchFocus: PropTypes.bool,
    isSearchMatch: PropTypes.bool,
    node: PropTypes.shape({}).isRequired,
    path: PropTypes.arrayOf(
        PropTypes.oneOfType([PropTypes.string, PropTypes.number])
    ).isRequired,
    scaffoldBlockPxWidth: PropTypes.number.isRequired,
    style: PropTypes.shape({}),
    subtitle: PropTypes.oneOfType([PropTypes.func, PropTypes.node]),
    swapDepth: PropTypes.number,
    swapFrom: PropTypes.number,
    swapLength: PropTypes.number,
    title: PropTypes.oneOfType([PropTypes.func, PropTypes.node]),
    toggleChildrenVisibility: PropTypes.func,
    treeIndex: PropTypes.number.isRequired,
    treeId: PropTypes.string.isRequired,

    // Drag and drop API functions
    // Drag source
    connectDragPreview: PropTypes.func.isRequired,
    connectDragSource: PropTypes.func.isRequired,
    didDrop: PropTypes.bool.isRequired,
    draggedNode: PropTypes.shape({}),
    isDragging: PropTypes.bool.isRequired,
    parentNode: PropTypes.shape({}), // Needed for dndManager
    // Drop target
    canDrop: PropTypes.bool,
    isOver: PropTypes.bool.isRequired,
};

export default CustomThemeNodeContentRenderer;