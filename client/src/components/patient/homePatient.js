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
<<<<<<< HEAD
                        <a className="overflow" href="/dht/myposts">
=======
                        <Link className="overflow" to="/mytoots">
>>>>>>> 0ebae85a8230bb0909d7fbb69dbf56f3e14e0bf3
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
<<<<<<< HEAD
                        <a className="overflow" href="/dht/mydevices">
=======
                        <Link className="overflow" to="/mydevices">
>>>>>>> 0ebae85a8230bb0909d7fbb69dbf56f3e14e0bf3
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