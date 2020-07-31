import React from 'react'
import { useState, useEffect } from 'react'
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';

function Devices() {
    useEffect(() => {
        fetchPosts();
    }, []);

    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [time, setTime] = useState();

    const fetchPosts = async () => {
        const data = await fetch('/patient/mydevices');

        const posts = await data.json();
        setLoading(true)

        setPosts(posts);
    };

    const columns = [
        {
            id: 'device',
            label: 'Devices',
        }
    ];

    let postsDevices = [...new Set(posts.map(content => content.postData.device))]

    let rows = {
        devices: postsDevices
    }

    const useStylesButton = makeStyles((theme) => ({
        root: {
            '& > *': {
                margin: theme.spacing(1)
            },
        }
    }));

    const useStylesTable = makeStyles({
        table: {
            minWidth: 650,
            marginBottom: "10%"
        },
    });

    const classesButton = useStylesButton();
    const classesTable = useStylesTable();

    const onChange = e => {
        setTime({ ...time, [e.target.name]: e.target.value });
    }

    return (
        <div className="container">
            <div id="devices-table">
                {posts.length ? (
                    <TableContainer component={Paper}>
                        <Table className={classesTable.table} aria-label="simple table">
                            <TableHead>
                                <TableRow>
                                    {columns.map(column => (
                                        <TableCell
                                            key={column.id}
                                            style={{ fontWeight: "bold" }}
                                            align="center">

                                            {column.label}
                                        </TableCell>
                                    ))}

                                </TableRow>
                            </TableHead>
                            <TableBody>
                                <TableRow>
                                    <TableCell
                                        align="center">

                                        {rows.devices}
                                    </TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </TableContainer>) : (
                        null
                    )}
            </div>
            <div className={classesButton.root} id="devices">
                <Button variant="contained" color="primary" href="http://localhost:5000/patient/mydevices/fitbit_auth" target="_blank" style={{ color: "white" }}>
                    Fitbit Flex
                </Button>
                <Button variant="contained" color="primary" href="http://localhost:5000/patient/mydevices/bpmonitor" target="_blank" style={{ color: "white" }}>
                    Blood pressure monitor
                </Button>
            </div>
            <div>
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
                <Grid item xs={12} spacing={3}>
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        style={{ width: "15%" }}
                    >
                        Submit
                    </Button>
                </Grid>
            </div>
        </div >
    );
}

export default Devices;