const Badge = ({ count }) => {
    if (!count) return null;

    return (
        <div
            style={{
                position: "absolute",
                pointerEvents: "none",
                borderRadius: "45%",
                top: "2px",
                right: "2px",
                width: "11px",
                height: "11px",
                padding: "4px",
                background: "#0aa2f2",
                border: "0px solid #666",
                color: "#fff",
                textAlign: "center",
                font: "10px Arial, sans-serif",
                lineHeight: "11px",
            }}
        >
            {count < 100 ? count : "99+"}
        </div>
    );
};

export default Badge;
