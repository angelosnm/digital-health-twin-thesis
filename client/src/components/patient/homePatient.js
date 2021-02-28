import React from 'react'
import './homePatient.css'
import { Row, Col, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';

function HomePatient() {
    return (
        <div className="home-cards-container">
            <Row className="justify-content-md-center">
                <Col lg="6" xs="12">
                    <Card>
                        <Link className="overflow" to="/mytoots">
                            <Card.Img src={require('../../images/mastodon-toots.png')} />
                        </Link>
                        <Card.Body>
                            <Card.Title>My posts</Card.Title>
                            <Card.Text>
                                See your posts
                            </Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
                <Col lg="6" xs="12">
                    <Card>
                        <Link className="overflow" to="/mydevices">
                            <Card.Img src={require('../../images/devices.png')} />
                        </Link>
                        <Card.Body>
                            <Card.Title>My devices</Card.Title>
                            <Card.Text>
                                See and add your advices
                            </Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </div>
    )

}


export default HomePatient;