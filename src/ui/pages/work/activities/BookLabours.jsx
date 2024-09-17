import * as React from "react";
import "./BookLabours.css";
import EISTable from "eam-components/dist/ui/components/table";
import { formatDate } from "@/ui/pages/EntityTools";

const propCodes = ["employeeDesc", "dateWorked", "hoursWorked"];

/**
 * Display detail of a book labour
 */
function BookLabours(props) {
  const headers = [
    props.layout.employee.text,
    props.layout.datework.text,
    props.layout.hrswork.text,
  ];

  if (props.bookLabours && props.bookLabours.length > 0) {
    return (
      <div className="booklabours">
        <EISTable
          data={props.bookLabours.map((bl) => ({
            ...bl,
            dateWorked: formatDate(bl.dateWorked),
          }))}
          headers={headers}
          propCodes={propCodes}
        />
      </div>
    );
  } else {
    return null;
  }
}

export default BookLabours;
