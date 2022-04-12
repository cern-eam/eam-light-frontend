import React from 'react';

const EAMTableDataAdapter = (props) => {
    const { fetchData, convertRowData, convertColumnMetadata } = props;
    const [loading, setLoading] = React.useState(true);
    const [mounted, setMounted] = React.useState(true);
    const [requestError, setRequestError] = React.useState(false);
    const [rows, setRows] = React.useState([]);
    const [columnsMetadata, setColumnsMetadata] = React.useState([]);

    React.useEffect(() => {
        (async () => {
            if (mounted) {
                setLoading(true);
                const response = await fetchData().catch(() => {
                    setLoading(false);
                    setRequestError(true);
                    return;
                });
                const responseBody = response && response.body;
                if (!responseBody) return;
                setRows(convertRowData(responseBody));
                setColumnsMetadata(convertColumnMetadata(responseBody));
                setLoading(false);
            }
        })();

        return () => setMounted(false);
    }, []);

    const context = {
        loading,
        requestError,
        rows,
        columnsMetadata,
    };

    return props.children(context);
};

export default EAMTableDataAdapter;
