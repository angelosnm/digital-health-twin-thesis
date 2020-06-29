import React, { Component } from 'react'
import { Link as RouterLink } from 'react-router-dom'
import { useState, useEffect } from 'react'
import * as ReactBootStrap from 'react-bootstrap';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import { Grid, Card, CardContent, CardMedia, Typography, TextField } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import Link from '@material-ui/core/Link'
import SearchIcon from '@material-ui/icons/Search'
import './patients.css';

function Patients() {

    useEffect(() => {
        fetchPatients();
    }, []);


    const [patients, setPatients] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchFilter, setSearchFilter] = useState([]);

    const fetchPatients = async () => {
        const data = await fetch('/mypatients');

        const patients = await data.json();
        setLoading(true)

        console.log(patients);
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
        cardMedia: {

        },
        searchContainer: {
            display: "flex",
            justifyContent: "center",
            marginBottom: "5%"
        },
        searchIcon: {
            alignSelf: "flex-end",
            margin: "5px"
        }
    })

    const getPatientCard = (patient) => {
        return (
            <Grid item xs={12} sm={4} key={patient.id}>
                <Link underline="none" component={RouterLink} to={`/mypatients/${patient.username}`}>
                    <Card>
                        <CardMedia
                            className={classes.cardMedia}

                        />
                        <img src={patient.avatar} style={{ width: "100%" }} />
                        <CardContent className={classes.cardContent}>
                            <Typography>
                                {patient.username}
                            </Typography>
                        </CardContent>
                    </Card>
                </Link>
            </Grid >
        );
    };

    const handleSearchChange = (e) => {
        setSearchFilter(e.target.value);
    }

    const classes = useStyles();

    return (
        <div className="patients">
            <h2> My Patients </h2>

            <div className={classes.searchContainer}>
                <SearchIcon className={classes.searchIcon} />
                <TextField className={classes.searchTextfield} label="Search user" onChange={handleSearchChange} variant="standard" />
            </div>

            <Grid container spacing={6} className={classes.container}>
                {patients.map(patient =>
                    patient.username.includes(searchFilter) &&
                    getPatientCard(patient))}
            </Grid>

        </div >


    );


}

export default Patients;