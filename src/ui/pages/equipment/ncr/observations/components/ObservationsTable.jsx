import EISTable from "eam-components/dist/ui/components/table";
import { HEADERS, PROP_CODES } from "../constants/observationsTable";

let linksMap = new Map([['workordernum', {linkType: 'fixed', linkValue: 'workorder/', linkPrefix: '/'}]]);

const ObservationsTable = ({ observations }) => {
    return (
        <EISTable
            data={observations}
            headers={HEADERS}
            propCodes={PROP_CODES}
            linksMap={linksMap}
        />
    );
};

export default ObservationsTable;
