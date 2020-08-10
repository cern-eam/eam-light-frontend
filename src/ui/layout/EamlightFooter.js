import React from "react";

export default props => {
    const { userData } = props;

    const screenNames = Object.entries(userData)
        .filter(([key,]) => key.endsWith('Screen'))
        .sort(([aKey,], [bKey,]) => aKey - bKey)
        .map(([_key, value]) => value)
        .join(', ')

    return (
        <div style={{
            zIndex: 99999999999999,
            position: "absolute",
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "#00aaff",
            padding: "6px",
            color: "white",
            textAlign: "right",
        }}>{screenNames}</div>
    );
};
