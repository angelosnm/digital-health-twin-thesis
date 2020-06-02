import React, { useState, useEffect } from 'react'
import { Line } from 'react-chartjs-2';
import * as ReactBootStrap from 'react-bootstrap';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import ToolkitProvider, { CSVExport } from 'react-bootstrap-table2-toolkit';
import './patient.css';
import { stringify } from 'qs';



function Patient({ match }) {
    useEffect(() => {
        fetchPatient();
        fetchFitbitFlexChart();
    }, []);


    const [patientData, setPatientData] = useState([]);
    const [chartData, setChart] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchPatient = async () => {
        const data = await fetch(`/mypatients/${match.params.patient}`);

        const patientData = await data.json();
        setLoading(true)


        setPatientData(patientData);

    };

    const fetchFitbitFlexChart = async () => {
        const data = await fetch(`/mypatients/${match.params.patient}`);

        const patientData = await data.json();

        let fitbitFlexData = patientData.filter(content => content.post.device === "Fitbit Flex")
        
        let indexStart = fitbitFlexData.length - 20
        indexStart = indexStart < 0 ? 0 : indexStart;
        let chartData = fitbitFlexData.slice(indexStart, fitbitFlexData.length)
        
        console.log(chartData)
        setChart(chartData);
    };
    
    const lineChart = (

        patientData.length
            ? (
                <Line data={{
                    labels: chartData.map(content => content.post.issued).filter((items, index) => index % 2 === 0),
                    datasets: [{
                        data: chartData.filter(content => content.post.component.value === "Calories burned").map(content => content.post.value.$numberInt),
                        backgroundColor: 'rgb(83, 144, 186)',
                        borderColor: 'rgb(83, 144, 186)',
                        fill: false,
                        label: "Measuered Calories",
                        pointRadius: 7
                    }, {
                        data: chartData.filter(content => content.post.component.value === "Steps").map(content => content.post.value.$numberInt),
                        backgroundColor: 'rgb(191, 29, 31)',
                        borderColor: 'rgb(191, 29, 31)',
                        fill: false,
                        label: "Measuered Steps",
                        pointRadius: 7
                    }]
                }}
                />) : null
    )


    const columns = [
        { dataField: "post.component.value", text: "Measured data", sort: true },
        { dataField: "post.value.$numberInt", text: "Value", sort: true },
        { dataField: "post.effective", text: "Date", sort: true },
        { dataField: "post.issued", text: "Time", sort: true },
        { dataField: "post.device", text: "Device", sort: true, },
        { dataField: "post.component.code", text: "LOINC", sort: true, }
    ]

    const pageButtonRenderer = ({
        page,
        onPageChange
    }) => {
        const handleClick = (e) => {
            e.preventDefault();
            onPageChange(page);
        };
        return (
            <li className="page-item">
                <ReactBootStrap.Button href="#" onClick={handleClick} variant="dark">{page}</ReactBootStrap.Button>
            </li>
        );
    };

    const sizePerPageRenderer = ({
        options,
        currSizePerPage,
        onSizePerPageChange
    }) => (
            <div className="btn-group" role="group">
                {
                    options.map((option) => {
                        const isSelect = currSizePerPage === `${option.page}`;
                        return (
                            <button
                                key={option.text}
                                type="button"
                                onClick={() => onSizePerPageChange(option.page)}
                                className={`btn ${isSelect ? 'btn-dark' : 'btn-info'}`}
                            >
                                {option.text}
                            </button>
                        );
                    })
                }
            </div>
        );

    const paginationOptions = {
        paginationSize: 4,
        pageStartIndex: 1,
        withFirstAndLast: false,
        firstPageText: 'First',
        prePageText: 'Back',
        nextPageText: 'Next',
        lastPageText: 'Last',
        nextPageTitle: 'First page',
        prePageTitle: 'Pre page',
        firstPageTitle: 'Next page',
        lastPageTitle: 'Last page',
        disablePageTitle: true,
        pageButtonRenderer,
        sizePerPageRenderer

    };

    const defaultSorted = [{
        dataField: 'name',
        order: 'desc'
    }];




    return (

        <div className="patient">
            <div className="chart">{lineChart}</div>
            {loading ? (<BootstrapTable
                classes="table table-dark table-striped table-bordered table-hover"
                keyField="id"
                data={patientData}
                columns={columns}
                defaultSorted={defaultSorted}
                pagination={paginationFactory(paginationOptions)}

            />) : (
                    <ReactBootStrap.Spinner animation="border" />
                )}

        </div>

    );
}


export default Patient;