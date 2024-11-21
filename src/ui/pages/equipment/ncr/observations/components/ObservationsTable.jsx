import EISTable from "eam-components/dist/ui/components/table";
import { HEADERS, PROP_CODES } from "../constants/observationsTable";

const ObservationsTable = ({ observations }) => {
    return (
        <EISTable
            data={observations}
            headers={HEADERS}
            propCodes={PROP_CODES}
        />
    );
};

export default ObservationsTable;
