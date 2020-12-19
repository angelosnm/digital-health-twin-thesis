import React from 'react'
import './homeDoctor.css'
import { Row, Col, Card } from 'react-bootstrap';

function HomeDoctor() {
    return (
        <div className="home-cards-container">
            <Row className="justify-content-md-center">
                <Col lg="6" xs="12">
                    <Card>
                        <a className="overflow" href="/mypatients">
                            <Card.Img src={require('../../images/patient.png')}/>
                        </a>
                        <Card.Body>
                            <Card.Title>My patients</Card.Title>
                            <Card.Text>
                                See your patients posts
                            </Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
                <Col lg="6" xs="12">
                    <Card>
                        <a className="overflow" href="/myalarms">
                            <Card.Img src={require('../../images/alarm.png')} />
                        </a>
                        <Card.Body>
                            <Card.Title>My alarms</Card.Title>
                            <Card.Text>
                                See and define your alarm posts for your patients
                            </Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </div>
    )

}


export default HomeDoctor;