import React, {Component} from 'react';
import './BookLabours.css';
import EISTable from 'eam-components/dist/ui/components/table';

const propCodes = ['employeeDesc', 'dateWorked', 'hoursWorked'];

/**
 * Display detail of a book labour
 */
export default class BookLabours extends Component {

    render() {
        const headers = [this.props.layout.employee.text, this.props.layout.datework.text, this.props.layout.hrswork.text];

        if (this.props.bookLabours && this.props.bookLabours.length > 0) {
            return (
                <div className="booklabours">
                    <h4>Booked labor</h4>
                    <EISTable data={this.props.bookLabours} headers={headers} propCodes={propCodes}/>
                </div>
            );
        }

        else {
            return null;
        }

    }
}