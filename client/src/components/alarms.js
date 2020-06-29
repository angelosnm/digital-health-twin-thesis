import React, { Component } from 'react'
import PropTypes from "prop-types";
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
        },
        {
            id: 'measured_data', label: 'Measured data',
        },
        {
            id: 'value',
            label: 'Value',
        },
        {
            id: 'date',
            label: 'Date',
        },
        {
            id: 'time',
            label: 'Time',
        },
        {
            id: 'device',
            label: 'Device'
        },
        {
            id: 'loinc',
            label: 'LOINC',
        },
    ];

    let rows = [];
    let tableData = {}

    for (let [key, value] of Object.entries(alarms)) {
        // console.log(value.postData.value)
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

    function descendingComparator(a, b, orderBy) {
        if (b[orderBy] < a[orderBy]) {
            return -1;
        }
        if (b[orderBy] > a[orderBy]) {
            return 1;
        }
        return 0;
    }

    function getComparator(order, orderBy) {
        return order === 'desc'
            ? (a, b) => descendingComparator(a, b, orderBy)
            : (a, b) => -descendingComparator(a, b, orderBy);
    }

    function stableSort(array, comparator) {
        const stabilizedThis = array.map((el, index) => [el, index]);
        stabilizedThis.sort((a, b) => {
            const order = comparator(a[0], b[0]);
            if (order !== 0) return order;
            return a[1] - b[1];
        });
        return stabilizedThis.map((el) => el[0]);
    }


    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };


    function EnhancedTableHead(props) {
        const { classes, order, orderBy, onRequestSort } = props;
        const createSortHandler = property => event => {
            onRequestSort(event, property);
        };

        return (
            <TableHead>
                <TableRow>
                    <TableCell />
                    {columns.map(column => (
                        <TableCell
                            key={column.id}
                            align={column.numeric ? "right" : "left"}
                            padding={column.disablePadding ? "none" : "default"}
                            sortDirection={orderBy === column.id ? order : false}
                            style={{ fontWeight: "bold" }}
                        >
                            <TableSortLabel
                                active={orderBy === column.id}
                                direction={orderBy === column.id ? order : "asc"}
                                onClick={createSortHandler(column.id)}
                            >
                                {column.label}
                                {orderBy === column.id ? (
                                    <span className={classes.visuallyHidden}>
                                        {order === "desc" ? "sorted descending" : "sorted ascending"}
                                    </span>
                                ) : null}
                            </TableSortLabel>
                        </TableCell>
                    ))}
                </TableRow>
            </TableHead>
        );
    }


    EnhancedTableHead.propTypes = {
        classes: PropTypes.object.isRequired,
        onRequestSort: PropTypes.func.isRequired,
        order: PropTypes.oneOf(["asc", "desc"]).isRequired,
        orderBy: PropTypes.string.isRequired
    };

    const useStyles = makeStyles(theme => ({
        root: {
            width: "100%",
            borderBottom: "purple"
        },
        paper: {
            width: "100%",
            marginBottom: theme.spacing(2)
        },
        table: {
            minWidth: 750
        },
        visuallyHidden: {
            border: 0,
            clip: "rect(0 0 0 0)",
            height: 1,
            margin: -1,
            overflow: "hidden",
            padding: 0,
            position: "absolute",
            top: 20,
            width: 1
        }
    }));

    const classes = useStyles();
    const [order, setOrder] = React.useState("asc");
    const [orderBy, setOrderBy] = React.useState("calories");
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);

    const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === "asc";
        setOrder(isAsc ? "desc" : "asc");
        setOrderBy(property);
    };

    const emptyRows =
        rowsPerPage - Math.min(rowsPerPage, rows.length - page * rowsPerPage);



    // const useStyles = makeStyles({
    //     root: {
    //         width: "auto",
    //     },
    //     container: {
    //         maxHeight: "440px",
    //     }
    // });


    // const classes = useStyles();
    // const [page, setPage] = React.useState(0);
    // const [rowsPerPage, setRowsPerPage] = React.useState(10);

    // const handleChangePage = (event, newPage) => {
    //     setPage(newPage);
    // };

    // const handleChangeRowsPerPage = (event) => {
    //     setRowsPerPage(+event.target.value);
    //     setPage(0);
    // };

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

            {/* {loading ? (
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
                )} */}

            <div className={classes.root}>
                {loading ? (<Paper className={classes.paper}>
                    <TableContainer>
                        <Table
                            className={classes.table}
                            aria-labelledby="tableTitle"
                            aria-label="enhanced table"
                        >
                            <EnhancedTableHead
                                classes={classes}
                                order={order}
                                orderBy={orderBy}
                                onRequestSort={handleRequestSort}
                            />
                            <TableBody>
                                {stableSort(rows, getComparator(order, orderBy))
                                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                    .map((row, index) => {
                                        return (
                                            <TableRow hover tabIndex={-1} >
                                                <TableCell />
                                                <TableCell component="th" scope="row" padding="none">{row.user}</TableCell>
                                                <TableCell>{row.measured_data}</TableCell>
                                                <TableCell>{row.value}</TableCell>
                                                <TableCell>{row.date}</TableCell>
                                                <TableCell>{row.time}</TableCell>
                                                <TableCell>{row.device}</TableCell>
                                                <TableCell>{row.loinc}</TableCell>
                                            </TableRow>
                                        );
                                    })}
                                {emptyRows > 0 && (
                                    <TableRow>
                                        <TableCell colSpan={6} />
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <TablePagination
                        rowsPerPageOptions={[10, 25, 50, { label: 'All', value: -1 }]}
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
            </div>
        </div >


    );


}

export default Alarms;