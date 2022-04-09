import React from 'react';
import './BookLabours.css';
import EISTable from 'eam-components/ui/components/table';

const propCodes = ['employeeDesc', 'dateWorked', 'hoursWorked'];

/**
 * Display detail of a book labour
 */
function BookLabours(props) {

    const headers = [props.layout.employee.text, props.layout.datework.text, props.layout.hrswork.text];

    if (props.bookLabours && props.bookLabours.length > 0) {
        return (
            <div className="booklabours">
                <h4>Booked labor</h4>
                <EISTable data={props.bookLabours} headers={headers} propCodes={propCodes}/>
            </div>
        );
    }

    else {
        return null;
    }

}

export default BookLabours