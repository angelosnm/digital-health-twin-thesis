import React from 'react'
import { useState, useEffect } from 'react'
import { Link as RouterLink } from 'react-router-dom'
import Link from '@material-ui/core/Link'
import { Grid, Card, CardContent, CardMedia, Typography, TextField } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import SearchIcon from '@material-ui/icons/Search'
import * as ReactBootStrap from 'react-bootstrap';
import './patients.css';

function Patients() {

    useEffect(() => {
        fetchPatients();
    }, []);


    const [patients, setPatients] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchFilter, setSearchFilter] = useState([]);

    const fetchPatients = async () => {
        const data = await fetch('/auth/doctor/mypatients');

        const patients = await data.json();
        setLoading(true)

        setPatients(patients);
    };

    const useStyles = makeStyles({
        container: {
            paddingTop: "20px",
            paddingLeft: "50px",
            paddingRight: "50px"
        },
        cardContent: {
            textAlign: "center"
        },
        avatar: {
            backgroundColor: "#3f51b58f",
        },
        searchContainer: {
            display: "flex",
            justifyContent: "center",
            marginBottom: "5%"
        },
        searchIcon: {
            alignSelf: "flex-end",
            margin: "5px",

        },
        searchTextfield: {
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
            '&. MuiInputBase-input MuiInput-input': {
                borderColor: '#34cfa3',
                color: '#34cfa3'
            }
        }
    })

    const getPatientCard = (patient) => {
        return (
            < Grid item xs={12} sm={4} key={patient.id} >
                <Card className={classes.card}>
                    <CardMedia
                        className={classes.cardMedia}
                        title={patient.username}
                    />
                    <Link underline="none" component={RouterLink} to={`/mypatients/${patient.username}`}>
                        <img src={patient.avatar} style={{ width: "100%" }} />
                    </Link>
                    <CardContent className={classes.cardContent}>
                        <Typography variant="p">
                            <strong>{patient.username}</strong>
                        </Typography>
                    </CardContent>
                    <CardContent className={classes.cardContent}>
                        <Typography variant="p">
                            <p>Total toots: {patient.statuses_count}</p>
                        </Typography>
                    </CardContent>
                </Card>
            </Grid >
        );
    };

    const handleSearchChange = (e) => {
        setSearchFilter(e.target.value);
    }

    const classes = useStyles();

    return (
        <div className="patients">
            {loading ? (
                <div>
                    <div className={classes.searchContainer}>
                        <SearchIcon className={classes.searchIcon} />
                        <TextField className={classes.searchTextfield} label="Search user" onChange={handleSearchChange} variant="standard" />
                    </div>

                    <Grid container spacing={6} className={classes.container}>
                        {patients.map(patient =>
                            patient.username.includes(searchFilter) &&
                            getPatientCard(patient))}
                    </Grid>
                </div>) : (
                    <ReactBootStrap.Spinner animation="border" />
                )}

        </div >


    );


}

export default Patients;