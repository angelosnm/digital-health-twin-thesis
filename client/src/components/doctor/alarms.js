import './alarms.css'
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
import CssBaseline from '@material-ui/core/CssBaseline';
import AlarmsImage from '../../images/alarms.png'

function Alarms() {

    useEffect(() => {
        fetchAlarms();
    }, []);


    const [alarms, setAlarms] = useState([]);
    const [alarmThresh, setAlarmThresh] = useState({ threshLowerDIAS: "", threshLowerSYS: "", threshLowerBPM: "", threshUpperSYS: "", threshUpperDIAS: "", threshUpperBPM: "" });
    const [message, setMessage] = useState(null);


    const fetchAlarms = async () => {
        const data = await fetch('/auth/doctor/myalarms');

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
            id: 'loinc_code',
            label: 'LOINC',
        },
    ];

    let rows = [];
    let tableData = {}

    // for (let [key, value] of Object.entries(alarms)) {
    //     tableData = {
    //         user: value.tootData.user,
    //         measured_data: value.tootData.component.value,
    //         value: value.tootData.value,
    //         date: value.tootData.date,
    //         time: value.tootData.issued,
    //         device: value.tootData.device,
    //         loinc: value.tootData.component.code
    //     }
    //     rows.push(tableData)
    // }

    for (let [value] of Object.entries(alarms)) {

        tableData = {
            user: alarms[value].tootData.mastodon_user,
            measured_data: alarms[value].tootData.measured_data,
            value: alarms[value].tootData.value,
            date: alarms[value].tootData.date,
            time: alarms[value].tootData.time,
            device: alarms[value].tootData.device,
            loinc_code: alarms[value].tootData.loinc_code
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

    const useStyles = makeStyles((theme) => ({
        root: {
            height: '72vh',
        },
        image: {
            backgroundImage: `url(${AlarmsImage})`,
            backgroundRepeat: 'no-repeat',
            backgroundColor:
                theme.palette.type === 'light' ? theme.palette.grey[50] : theme.palette.grey[900],
            backgroundSize: 'cover',
            backgroundPosition: 'center',
        },
        paper: {
            margin: theme.spacing(8, 4),
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
        },
        form: {
            width: '100%', // Fix IE 11 issue.
            marginTop: theme.spacing(1),
            marginBottom: "10%",
            '& label.Mui-focused': {
                color: '#34cfa3',
            },
            '& .MuiInput-underline:after': {
                borderBottomColor: '#34cfa3',
            },
            '& .MuiOutlinedInput-root': {
                '&.Mui-focused fieldset': {
                    borderColor: '#34cfa3',
                },
            },
        },
        submit: {
            margin: theme.spacing(3, 0, 2),
            backgroundColor: "#34cfa3"
        },
    }));

    const classes = useStyles();

    // const classesThresholdsFields = useStylesThresholdsFields();
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
            < div className="alarming-thresholds">
                <h3>Define your alarming thresholds</h3>
                <Grid container component="main" className={classes.root}>
                    <CssBaseline />
                    <Grid item xs={false} sm={4} md={7} className={classes.image} />
                    <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
                        <div className={classes.paper}>
                            <form onSubmit={onSubmit} className={classes.form} noValidate>
                                {/* <form className={classesThresholdsFields.root} onSubmit={onSubmit}> */}
                                <TextField
                                    onChange={onChange}
                                    id="dias_lower"
                                    label="Diastolic blood pressure lower threshold"
                                    type="number"
                                    name="threshLowerDIAS"
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    margin="normal"
                                    autoFocus
                                    fullWidth
                                />
                                <TextField
                                    onChange={onChange}
                                    id="sys_lower"
                                    label="Systolic blood pressure lower threshold"
                                    type="number"
                                    name="threshLowerSYS"
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    margin="normal"
                                    autoFocus
                                    fullWidth
                                />
                                <TextField
                                    onChange={onChange}
                                    id="bpm_lower"
                                    label="Heartrate lower threshold"
                                    type="number"
                                    name="threshLowerBPM"
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    margin="normal"
                                    autoFocus
                                    fullWidth
                                />
                                <TextField
                                    onChange={onChange}
                                    id="dias_upper"
                                    label="Diastolic blood pressure upper threshold"
                                    type="number"
                                    name="threshUpperDIAS"
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    margin="normal"
                                    autoFocus
                                    fullWidth
                                />
                                <TextField
                                    onChange={onChange}
                                    id="sys_upper"
                                    label="Systolic blood pressure upper threshold"
                                    type="number"
                                    name="threshUpperSYS"
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    margin="normal"
                                    autoFocus
                                    fullWidth
                                />
                                <TextField
                                    onChange={onChange}
                                    id="bpm_upper"
                                    label="Heartrate upper threshold"
                                    type="number"
                                    name="threshUpperBPM"
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    margin="normal"
                                    autoFocus
                                    fullWidth
                                />

                                <Button
                                    type="submit"
                                    fullWidth
                                    variant="contained"
                                    color="primary"
                                    className={classes.submit}
                                    style={{ width: "15%" }}
                                >
                                    Submit
                                </Button>
                            </form>
                        </div>
                    </Grid>
                </Grid>
            </div>
            <div className="alarms-toots-table">
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
                                                <TableCell>{row.loinc_code}</TableCell>
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
            </div >
        </div>
    );
}

export default Alarms;