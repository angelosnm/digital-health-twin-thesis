import React, { Component } from 'react'
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react'
import * as ReactBootStrap from 'react-bootstrap';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import './patients.css';

function Patients() {

    useEffect(() => {
        fetchPatients();
    }, []);


    const [patients, setPatients] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchPatients = async () => {
        const data = await fetch('/mypatients');

        const patients = await data.json();
        setLoading(true)

        console.log(patients);
        setPatients(patients);
    };

    const columns = [
        { dataField: "username", text: "User", sort: true },
        { dataField: "last_status_at", text: "Last posted", sort: true },
        { dataField: "url", text: "Mastodon profile", sort: true },
    ]

    const defaultSorted = [{
        dataField: 'name',
        order: 'desc'
    }];

    const paginationOptions = {
        paginationSize: 5,
        pageStartIndex: 1,
        withFirstAndLast: false,
        hideSizePerPage: true, // Hide the sizePerPage dropdown always
        hidePageListOnlyOnePage: true, // Hide the pagination list when only one page
        firstPageText: 'First',
        prePageText: 'Back',
        nextPageText: 'Next',
        lastPageText: 'Last',
        nextPageTitle: 'First page',
        prePageTitle: 'Pre page',
        firstPageTitle: 'Next page',
        lastPageTitle: 'Last page',
        disablePageTitle: true,
    };

    return (
        <div className="patients">
            <h2> My Patients </h2>
            <ul style={{ listStyleType: "none" }} >
                <div className="flex-container">
                    {patients.map(patient =>
                        <Link to={`/mypatients/${patient.username}`}>
                            <li id="patientsList"> {patient.username} <img src={patient.avatar} width="128px" alt=""></img></li></Link>)}
                </div>
            </ul>

            
        </div >


    );


}

export default Patients;