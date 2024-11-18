import { useState, useEffect } from "react";
import WSNCRs from "../../../../../tools/WSNCRs";
import EISTable from "eam-components/dist/ui/components/table";
import BlockUi from "react-block-ui";

const Observations = (props) => {
  const headers = [
    "Observation",
    "Severity",
    "Condition Score",
    "Condition Index",
    "Recorded By",
    "Date Recorded",
  ];
  const propCodes = [
    "observation",
    "severity_display",
    "conditionscore",
    "conditionindex_display",
    "recordedby",
    "daterecorded",
  ];

  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState([]);

  useEffect(() => {
    fetchData(props.ncr.code);
  }, [props.ncr.code]);

  const adjustData = (data) => {
    return data.map((observation) => ({
      ...observation,
    }));
  };

  const fetchData = (ncr) => {
    setIsLoading(true);
    if (ncr) {
      WSNCRs.getNonConformityObservations(ncr)
        .then((response) => {
          const data = adjustData(response.body.data);
          setData(data);
          setIsLoading(false);
        })
        .catch((error) => {
          console.log(error);
          setIsLoading(false);
        });
    }
  };

  return isLoading ? (
    <BlockUi tag="div" blocking={isLoading} style={{ width: "100%" }} />
  ) : (
    <>
      <div style={{ width: "100%", height: "100%" }}>
        {data?.length > 0 && (
          <EISTable data={data} headers={headers} propCodes={propCodes} />
        )}
      </div>
    </>
  );
};

export default Observations;
