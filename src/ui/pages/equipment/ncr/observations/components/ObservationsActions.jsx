import Button from "@mui/material/Button";

const ObservationsActions = ({
    handleAddObservationClick,
    handleCreateWorkOrderClick,
    disabled,
}) => {
    return (
        <div style={{ display: "flex", columnGap: 10 }}>
            <Button
                onClick={handleAddObservationClick}
                color="primary"
                disabled={disabled}
                variant="outlined"
            >
                Add Observation
            </Button>
            <Button
                onClick={handleCreateWorkOrderClick}
                color="primary"
                disabled={disabled}
                variant="outlined"
            >
                Create WO
            </Button>
        </div>
    );
};

export default ObservationsActions;
