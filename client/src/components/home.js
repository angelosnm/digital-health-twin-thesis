import React, { Component } from 'react'
import { Link } from 'react-router-dom';
import './home.css'
import { Row, Col, Container, Card, Button } from 'react-bootstrap';

function Home() {
    return (
        <Container>
            <Row className="justify-content-md-center">
                <Col lg="4" xs="12">
                    <Card>
                        <a className="overflow" href="/mypatients">
                            <Card.Img src={require('../images/patient.png')} />
                        </a>
                        <Card.Body>
                            <Card.Title>My patients</Card.Title>
                            <Card.Text>
                                Some quick example text to build on the card title and make up the bulk of
                                the card's content.
                            </Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
                <Col lg="4" xs="12">
                    <Card>
                        <a className="overflow" href="/myalarms">
                            <Card.Img src={require('../images/alarm.png')} />
                        </a>
                        <Card.Body>
                            <Card.Title>My alarms</Card.Title>
                            <Card.Text>
                                Some quick example text to build on the card title and make up the bulk of
                                the card's content.
                            </Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
                <Col lg="4" xs="12">
                    <Card>
                        <a className="overflow" href="/mypatients">
                            <Card.Img src={require('../images/patient.png')} />
                        </a>
                        <Card.Body>
                            <Card.Title>My patients</Card.Title>
                            <Card.Text>
                                Some quick example text to build on the card title and make up the bulk of
                                the card's content.
                            </Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    )

}


export default Home;