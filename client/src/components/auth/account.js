import React from 'react'
import { useState, useEffect } from 'react'
import { Row, Col, Card} from 'react-bootstrap';


function Account() {

    useEffect(() => {
        fetchAccount();
    }, []);


    const [account, setAccount] = useState([]);

    const fetchAccount = async () => {
        const data = await fetch('/user/account');

        const accountData = await data.json();

        console.log(accountData);
        setAccount(accountData);
    };

    return (
        <Row className="justify-content-md-center">
            <Col lg="4" xs="12">
                <Card>
                    <a className="overflow" href="/mypatients">
                        <Card.Img src={require('../../images/patient.png')} />
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
    )
}

export default Account;