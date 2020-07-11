import React, { useState, useEffect } from 'react'
import PropTypes from "prop-types";
import { Line } from 'react-chartjs-2';
import * as ReactBootStrap from 'react-bootstrap';
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
import FirstPageIcon from '@material-ui/icons/FirstPage';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';
import LastPageIcon from '@material-ui/icons/LastPage';

import './patient.css';



function Patient({ match }) {
    useEffect(() => {
        fetchPatient();
        fetchFitbitFlexChart();
        fetchHeartrateDataChart();
    }, []);


    const [patientData, setPatientData] = useState([]);
    const [fitbitFlexDatachartData, setChartFitbitFlex] = useState([]);
    const [heartrateDatachartData, setChartheartrateData] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchPatient = async () => {
        const data = await fetch(`/user/mypatients/${match.params.patient}`);

        const patientData = await data.json();
        setLoading(true)

        console.log(patientData.map(content => content.postData.issued))
        setPatientData(patientData);

    };

    const fetchFitbitFlexChart = async () => {
        const data = await fetch(`/user/mypatients/${match.params.patient}`);

        const patientData = await data.json();

        let fitbitFlexData = patientData.filter(content => content.postData.device === "Fitbit Flex")

        let indexStart = fitbitFlexData.length - 20
        indexStart = indexStart < 0 ? 0 : indexStart;
        let fitbitFlexDatachartData = fitbitFlexData.slice(indexStart, fitbitFlexData.length)

        console.log(fitbitFlexDatachartData)
        setChartFitbitFlex(fitbitFlexDatachartData);
    };

    const fetchHeartrateDataChart = async () => {
        const data = await fetch(`/user/mypatients/${match.params.patient}`);

        const patientData = await data.json();

        let heartrateData = patientData.filter(content => content.postData.device === " ")

        let indexStart = heartrateData.length - 20
        indexStart = indexStart < 0 ? 0 : indexStart;
        let heartrateDatachartData = heartrateData.slice(indexStart, heartrateData.length)

        console.log(heartrateDatachartData)
        setChartheartrateData(heartrateDatachartData);
    };

    const lineChartfitbitFlex = (

        patientData.length
            ? (
                <Line data={{
                    labels: fitbitFlexDatachartData.map(content => content.postData.issued).filter((items, index) => index % 2 === 0),
                    datasets: [{
                        data: fitbitFlexDatachartData.filter(content => content.postData.component.value === "Calories burned").map(content => content.postData.value.$numberInt),
                        backgroundColor: 'rgb(83, 144, 186)',
                        borderColor: 'rgb(83, 144, 186)',
                        fill: false,
                        label: "Measuered Calories",
                        pointRadius: 7
                    }, {
                        data: fitbitFlexDatachartData.filter(content => content.postData.component.value === "Steps").map(content => content.postData.value.$numberInt),
                        backgroundColor: 'rgb(191, 29, 31)',
                        borderColor: 'rgb(191, 29, 31)',
                        fill: false,
                        label: "Measuered Steps",
                        pointRadius: 7
                    }]
                }}
                />) : null
    )

    const lineChartheartrateData = (

        patientData.length
            ? (
                <Line data={{
                    labels: heartrateDatachartData.map(content => content.postData.issued).filter((items, index) => index % 2 === 0),
                    datasets: [{
                        data: heartrateDatachartData.filter(content => content.postData.component.value === "BP sys").map(content => content.postData.value.$numberInt),
                        backgroundColor: 'rgb(83, 144, 186)',
                        borderColor: 'rgb(83, 144, 186)',
                        fill: false,
                        label: "Systolic blood pressure",
                        pointRadius: 7
                    },
                    {
                        data: heartrateDatachartData.filter(content => content.postData.component.value === "BP dias").map(content => content.postData.value.$numberInt),
                        backgroundColor: 'rgb(191, 29, 31)',
                        borderColor: 'rgb(191, 29, 31)',
                        fill: false,
                        label: "Diastolic blood pressure",
                        pointRadius: 7
                    }, {
                        data: heartrateDatachartData.filter(content => content.postData.component.value === "Heart rate").map(content => content.postData.value.$numberInt),
                        backgroundColor: 'rgb(10%, 100%, 10%)',
                        borderColor: 'rgb(10%, 100%, 10%)',
                        fill: false,
                        label: "Beats per minute",
                        pointRadius: 7
                    }]
                }}
                />) : null
    )


    const columns = [
        {
            id: 'measured_data',
            label: 'Measured data',
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
            label: 'Device',
        },
        {
            id: 'loinc',
            label: 'LOINC',
        }
    ];


    let rows = [];
    let tableData = {}

    for (let [key, value] of Object.entries(patientData)) {
        tableData = {
            measured_data: value.postData.component.value,
            value: value.postData.value.$numberInt,
            date: value.postData.effective,
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

    return (
        <div className="patient">
            <div id="charts">
                <div className="chartFitbitFlex">{lineChartfitbitFlex}</div>
                <div className="chartHeartrateData">{lineChartheartrateData}</div>
            </div>
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
                                                <TableCell component="th" scope="row" padding="none">
                                                    {row.measured_data}
                                                </TableCell>
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
        </div>
    );
}


export default Patient;