import React, { Component } from 'react'
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react'
import * as ReactBootStrap from 'react-bootstrap';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
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

    const columns = [
        { dataField: "postData.user", text: "User", sort: true },
        { dataField: "postData.component.value", text: "Measured data", sort: true, },
        { dataField: "postData.value.$numberInt", text: "Value", sort: true },
        { dataField: "postData.date", text: "Date", sort: true },
        { dataField: "postData.issued", text: "Time", sort: true },
        { dataField: "postData.device", text: "Device", sort: true, },
        { dataField: "postData.component.code", text: "LOINC", sort: true, }
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
        <div className="alarms">
            <h2> My Alarms </h2>
            {loading ? (<BootstrapTable
                classes="table table-dark table-striped table-bordered table-hover"
                keyField="id"
                data={alarms}
                columns={columns}
                defaultSorted={defaultSorted}
                pagination={paginationFactory(paginationOptions)}

            />) : (
                    <ReactBootStrap.Spinner animation="border" />
                )}

        </div >


    );


}

export default Alarms;