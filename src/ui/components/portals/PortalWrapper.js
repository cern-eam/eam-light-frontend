import React from 'react'

const PortalWrapper = (props) => {
    const { Portal, predicate, children } = props;
    return (predicate && predicate()
        ? <Portal {...props}>{children}</Portal>
        : children
    )
}

export default PortalWrapper;
