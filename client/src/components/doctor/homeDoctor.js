import React from 'react'
import './homeDoctor.css'
import { Row, Col, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';

function HomeDoctor() {
    return (
        <div className="home-cards-container">
            <Row className="justify-content-md-center">
                <Col lg="6" xs="12">
                    <Card>
                        <Link className="overflow" to="/mypatients">
                            <Card.Img src={require('../../images/patient.png')} />
                        </Link>
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
                        <Link className="overflow" to="/myalarms">
                            <Card.Img src={require('../../images/alarm.png')} />
                        </Link>
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