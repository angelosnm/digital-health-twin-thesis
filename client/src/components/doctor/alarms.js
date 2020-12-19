import React from 'react'
import PropTypes from "prop-types";
import { useState, useEffect } from 'react'
import { AuthContext } from '../../Context/AuthContext';
import DataService from '../../Services/DataService';
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
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import { Typography } from '@material-ui/core';

function Alarms() {

    useEffect(() => {
        fetchAlarms();
    }, []);


    const [alarms, setAlarms] = useState([]);
    const [alarmThresh, setAlarmThresh] = useState({ threshLowerDIAS: "", threshLowerSYS: "", threshLowerBPM: "", threshUpperSYS: "", threshUpperDIAS: "", threshUpperBPM: "" });
    const [message, setMessage] = useState(null);


    const fetchAlarms = async () => {
        const data = await fetch('/doctor/myalarms');

        const alarms = await data.json();

        setAlarms(alarms);
    };


    // Alarming mechanism
    const onChange = e => {
        setAlarmThresh({ ...alarmThresh, [e.target.name]: e.target.value });
    }

    const resetForm = () => {
        setAlarmThresh({ threshLowerDIAS: "", threshLowerSYS: "", threshLowerBPM: "", threshUpperSYS: "", threshUpperDIAS: "", threshUpperBPM: "" });
    }

    const onSubmit = e => {
        e.preventDefault();
        DataService.postAlarmThresholds(alarmThresh).then(data => {
            console.log(data)
            const { message } = data;
            setMessage(message);

            resetForm();
            if (message.msgBody === "Unauthorized") {
                setMessage(message);
                AuthContext.setUser({ username: "", role: "" });
                AuthContext.setIsAuthenticated(false);
            }
            else {
                setMessage(message);
            }
        });
    }



    // Table data
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
        tableData = {
            user: value.postData.user,
            measured_data: value.postData.component.value,
            value: value.postData.value,
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
        const { classesTable, order, orderBy, onRequestSort } = props;
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
                                    <span className={classesTable.visuallyHidden}>
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
        classesTable: PropTypes.object.isRequired,
        onRequestSort: PropTypes.func.isRequired,
        order: PropTypes.oneOf(["asc", "desc"]).isRequired,
        orderBy: PropTypes.string.isRequired
    };

    const useStylesTable = makeStyles(theme => ({
        root: {
            width: "100%",
            borderBottom: "purple"
        },
        paper: {
            width: "100%",
            marginBottom: theme.spacing(2),
            marginTop: "10%"
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

    const useStylesThresholdsFields = makeStyles((theme) => ({
        root: {
            '& .MuiTextField-root': {
                margin: theme.spacing(3),
                width: '25ch',
                marginTop: "10%",

            }
        },
        submit: {
            margin: theme.spacing(3, 0, 2),
        },
        paper: {
            marginTop: theme.spacing(8),
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',

        },
    }));

    const classesThresholdsFields = useStylesThresholdsFields();
    const classesTable = useStylesTable();
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
        <div className="alarms">
            {alarms.length ? (<Paper className={classesTable.paper}>
                <TableContainer>
                    <Table
                        className={classesTable.table}
                        aria-labelledby="tableTitle"
                        aria-label="enhanced table"
                    >
                        <EnhancedTableHead
                            classesTable={classesTable}
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
                    null
                )}

            < div className="alarming-thresholds">
                <Typography>Define your alarming thresholds from the below buttons</Typography>
                <form className={classesThresholdsFields.root} onSubmit={onSubmit}>
                    <Grid container
                        justify="center"
                        alignItems="center">
                        <Grid item xs={4} spacing={3}>
                            <TextField
                                onChange={onChange}
                                id="sys"
                                label="Diastolic blood pressure lower threshold"
                                type="number"
                                name="threshLowerDIAS"
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                variant="outlined"
                            />
                        </Grid>
                        <Grid item xs={4} spacing={3}>
                            <TextField
                                onChange={onChange}
                                id="dias"
                                label="Systolic blood pressure lower threshold"
                                type="number"
                                name="threshLowerSYS"
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                variant="outlined"
                            />
                        </Grid>
                        <Grid item xs={4} spacing={3}>
                            <TextField
                                onChange={onChange}
                                id="bpm"
                                label="Heartrate lower threshold"
                                type="number"
                                name="threshLowerBPM"
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                variant="outlined"
                            />
                        </Grid>
                        <Grid item xs={4} spacing={3}>
                            <TextField
                                onChange={onChange}
                                id="sys"
                                label="Diastolic blood pressure upper threshold"
                                type="number"
                                name="threshUpperDIAS"
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                variant="outlined"
                            />
                        </Grid>
                        <Grid item xs={4} spacing={3}>
                            <TextField
                                onChange={onChange}
                                id="dias"
                                label="Systolic blood pressure upper threshold"
                                type="number"
                                name="threshUpperSYS"
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                variant="outlined"
                            />
                        </Grid>
                        <Grid item xs={4} spacing={3}>
                            <TextField
                                onChange={onChange}
                                id="bpm"
                                label="Heartrate upper threshold"
                                type="number"
                                name="threshUpperBPM"
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                variant="outlined"
                            />
                        </Grid>

                        <Grid item xs={12} spacing={3}>
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                color="primary"
                                className={classesThresholdsFields.submit}
                                style={{ width: "15%" }}
                            >
                                Submit
                    </Button>
                        </Grid>
                    </Grid>
                </form>
            </div>
        </div >
    );
}

export default Alarms;