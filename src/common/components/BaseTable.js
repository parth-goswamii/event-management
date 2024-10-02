import React from 'react';
import PropTypes from 'prop-types';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    TableContainer,
    Paper,
} from '@mui/material';
import moment from 'moment/moment';

const BaseTable = ({ columns, data, noDataMessage = 'No data available', isLoading = false }) => {
    const getNestedValue = (row, key) => {
        
        const value = key.split('.').reduce((obj, keyPart) => {
            if(key === 'created_at' || key === "event_date")
            {
                return moment(obj?.[keyPart]).format('L')
            }
            return obj ? obj[keyPart] : undefined;
        }, row);
        

        return value || 'N/A';
    };

    if (isLoading) {
        return <div>Loading...</div>; 
    }

    return (
        <TableContainer component={Paper}>
            <Table>
                <TableHead>
                    <TableRow>
                        {columns.map((column) => (
                            <TableCell key={column.id}>{column.label}</TableCell>
                        ))}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {data.length > 0 ? (
                        data.map((row, rowIndex) => (
                            <TableRow key={row.id || rowIndex}>
                                {columns.map((column) => (
                                    <TableCell key={column.id}>
                                        {getNestedValue(row, column.id)}
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={columns.length}>
                                {noDataMessage}
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

BaseTable.propTypes = {
    columns: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.string.isRequired,
            label: PropTypes.string.isRequired,
        })
    ).isRequired,
    data: PropTypes.arrayOf(PropTypes.object).isRequired,
    noDataMessage: PropTypes.string,
    isLoading: PropTypes.bool,
};

export default BaseTable;
