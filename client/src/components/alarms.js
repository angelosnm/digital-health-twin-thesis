import React, { Component } from 'react'
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react'
import * as ReactBootStrap from 'react-bootstrap';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import './alarms.css';

function Alarms() {

    useEffect(() => {
        fetchAlarms();
    }, []);


    const [alarms, setAlarms] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchAlarms = async () => {
        const data = await fetch('/myalarms');

        const alarms = await data.json();
        setLoading(true)

        console.log(alarms);
        setAlarms(alarms);
    };

    // const columns = [
    //     { dataField: "postData.user", text: "User", sort: true },
    //     { dataField: "postData.component.value", text: "Measured data", sort: true, },
    //     { dataField: "postData.value.$numberInt", text: "Value", sort: true },
    //     { dataField: "postData.date", text: "Date", sort: true },
    //     { dataField: "postData.issued", text: "Time", sort: true },
    //     { dataField: "postData.device", text: "Device", sort: true, },
    //     { dataField: "postData.component.code", text: "LOINC", sort: true, }
    // ]

    const columns = [

        {
            id: 'user', label: 'User',
            // minWidth: 170
        },
        {
            id: 'measured_data', label: 'Measured data',
            // minWidth: 100
        },
        {
            id: 'value',
            label: 'Value',
            // minWidth: 170,
        },
        {
            id: 'date',
            label: 'Date',
            // minWidth: 170,
        },
        {
            id: 'time',
            label: 'Time',
            // minWidth: 170,
        },
        {
            id: 'device',
            label: 'Device'
        },
        {
            id: 'loinc',
            label: 'LOINC',
            // minWidth: 170,
        },
    ];

    let rows = [];
    let tableData = {}

    for (let [key, value] of Object.entries(alarms)) {
        console.log(value)
        tableData = {
            user: value.postData.user,
            measured_data: value.postData.component.value,
            value: value.postData.value.$numberInt,
            date: value.postData.date,
            time: value.postData.issued,
            device: value.postData.device,
            loinc: value.postData.component.code
        }
        rows.push(tableData)

    }


    const useStyles = makeStyles({
        root: {
            width: "auto",
        },
        container: {
            maxHeight: "440px",
        }
    });


    const classes = useStyles();
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    // const defaultSorted = [{
    //     dataField: 'name',
    //     order: 'desc'
    // }];

    // const paginationOptions = {
    //     paginationSize: 5,
    //     pageStartIndex: 1,
    //     withFirstAndLast: false,
    //     hideSizePerPage: true, // Hide the sizePerPage dropdown always
    //     hidePageListOnlyOnePage: true, // Hide the pagination list when only one page
    //     firstPageText: 'First',
    //     prePageText: 'Back',
    //     nextPageText: 'Next',
    //     lastPageText: 'Last',
    //     nextPageTitle: 'First page',
    //     prePageTitle: 'Pre page',
    //     firstPageTitle: 'Next page',
    //     lastPageTitle: 'Last page',
    //     disablePageTitle: true,
    // };

    return (
        <div className="alarms">
            <h2> My Alarms </h2>
            {/* {loading ? (<BootstrapTable
                classes="table table-dark table-striped table-bordered table-hover"
                keyField="id"
                data={alarms}
                columns={columns}
                defaultSorted={defaultSorted}
                pagination={paginationFactory(paginationOptions)}

            />) : (
                    <ReactBootStrap.Spinner animation="border" />
                )} */}

            {loading ? (
                <Paper className={classes.root}>
                    <TableContainer className={classes.container}>
                        <Table stickyHeader aria-label="sticky table">
                            <TableHead
                            >
                                <TableRow>
                                    {columns.map((column) => (
                                        <TableCell
                                            key={column.id}
                                        // align={column.align}
                                        >
                                            {column.label}
                                            <TableSortLabel
                                                direction='asc'
                                            >


                                            </TableSortLabel>
                                        </TableCell>
                                    ))}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                                    return (
                                        <TableRow hover tabIndex={-1} key={row.code}>
                                            {columns.map((column) => {
                                                const value = row[column.id];
                                                return (
                                                    <TableCell key={column.id} align={column.align}>
                                                        {column.format && typeof value === 'number' ? column.format(value) : value}
                                                    </TableCell>
                                                );
                                            })}
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <TablePagination
                        rowsPerPageOptions={[10, 25, 100]}
                        component="div"
                        count={rows.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onChangePage={handleChangePage}
                        onChangeRowsPerPage={handleChangeRowsPerPage}
                    />
                </Paper>) : (
                    <ReactBootStrap.Spinner animation="border" />
                )}
        </div >


    );


}

export default Alarms;