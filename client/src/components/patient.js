import React, { useState, useEffect } from 'react'
import { Line } from 'react-chartjs-2';
import * as ReactBootStrap from 'react-bootstrap';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import ToolkitProvider, { CSVExport } from 'react-bootstrap-table2-toolkit';
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
        const data = await fetch(`/mypatients/${match.params.patient}`);

        const patientData = await data.json();
        setLoading(true)


        setPatientData(patientData);

    };

    const fetchFitbitFlexChart = async () => {
        const data = await fetch(`/mypatients/${match.params.patient}`);

        const patientData = await data.json();

        let fitbitFlexData = patientData.filter(content => content.postData.device === "Fitbit Flex")

        let indexStart = fitbitFlexData.length - 20
        indexStart = indexStart < 0 ? 0 : indexStart;
        let fitbitFlexDatachartData = fitbitFlexData.slice(indexStart, fitbitFlexData.length)

        console.log(fitbitFlexDatachartData)
        setChartFitbitFlex(fitbitFlexDatachartData);
    };

    const fetchHeartrateDataChart = async () => {
        const data = await fetch(`/mypatients/${match.params.patient}`);

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
        { dataField: "postData.component.value", text: "Measured data", sort: true },
        { dataField: "postData.value.$numberInt", text: "Value", sort: true },
        { dataField: "postData.effective", text: "Date", sort: true },
        { dataField: "postData.issued", text: "Time", sort: true },
        { dataField: "postData.device", text: "Device", sort: true, },
        { dataField: "postData.component.code", text: "LOINC", sort: true, }
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
            <div id="charts">
                <div className="chartFitbitFlex">{lineChartfitbitFlex}</div>
                <div className="chartHeartrateData">{lineChartheartrateData}</div>
            </div>
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