import React from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMapMarkerAlt, faPhoneSquareAlt } from "@fortawesome/free-solid-svg-icons";
import { library }from '@fortawesome/fontawesome-svg-core';
import './footer.css'

function Footer() {

    library.add(faMapMarkerAlt);
    library.add(faPhoneSquareAlt);

    return (
        <div className="footer">
            <div className="footer-container">
                <img src={require('../../../images/logo-uniwa.png')}></img>
                <div className="col-lg-4 col-md-4 col-sm-4">
                    <p>  University Campus II (Ancient Olive Grove)</p>
                    <p> <FontAwesomeIcon icon="map-marker-alt" style={{ color: "rgb(65, 196, 161)", fontSize: "22px", marginRight: "10px" }} /> Thivon 250 & Petrou Ralli street, Egaleo, GR 12241</p>
                    <p> <FontAwesomeIcon icon="phone-square-alt" style={{ color: "rgb(65, 196, 161)", fontSize: "22px", marginRight: "10px" }} /> (+30) 210.538.1514, (+30) 210.538.1549, (+30) 210.538.1637</p>
                </div>
                <img src={require('../../../images/logo-consert-uniwa.ico')}></img>
            </div>
            © Copyright - 2020
            <div>

            </div>
        </div>
    );

}

export default Footer;